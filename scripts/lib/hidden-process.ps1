# Hidden child-process spawn for the blog conveyor.
# Do NOT use Start-Process -WindowStyle Hidden on powershell.exe - on this host
# that tears down long-lived loops. Node -WindowStyle Hidden is fine.
# Dot-source after $RepoRoot is set.

if (-not ("BlogHiddenProcessNative" -as [type])) {
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public static class BlogHiddenProcessNative {
    [StructLayout(LayoutKind.Sequential)]
    public struct STARTUPINFO {
        public int cb;
        public IntPtr lpReserved;
        public IntPtr lpDesktop;
        public IntPtr lpTitle;
        public int dwX, dwY, dwXSize, dwYSize, dwXCountChars, dwYCountChars, dwFillAttribute;
        public int dwFlags;
        public short wShowWindow;
        public short cbReserved2;
        public IntPtr lpReserved2;
        public IntPtr hStdInput, hStdOutput, hStdError;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct PROCESS_INFORMATION {
        public IntPtr hProcess, hThread;
        public int dwProcessId, dwThreadId;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct SECURITY_ATTRIBUTES {
        public int nLength;
        public IntPtr lpSecurityDescriptor;
        public int bInheritHandle;
    }

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool CreateProcess(
        string lpApplicationName,
        StringBuilder lpCommandLine,
        IntPtr lpProcessAttributes,
        IntPtr lpThreadAttributes,
        bool bInheritHandles,
        uint dwCreationFlags,
        IntPtr lpEnvironment,
        string lpCurrentDirectory,
        ref STARTUPINFO lpStartupInfo,
        out PROCESS_INFORMATION lpProcessInformation);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern IntPtr CreateFile(
        string lpFileName,
        uint dwDesiredAccess,
        uint dwShareMode,
        ref SECURITY_ATTRIBUTES lpSecurityAttributes,
        uint dwCreationDisposition,
        uint dwFlagsAndAttributes,
        IntPtr hTemplateFile);

    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetFilePointerEx(IntPtr hFile, long liDistanceToMove, IntPtr lpNewFilePointer, uint dwMoveMethod);

    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool CloseHandle(IntPtr hObject);

    const uint GENERIC_READ = 0x80000000;
    const uint GENERIC_WRITE = 0x40000000;
    const uint FILE_SHARE_READ = 1;
    const uint FILE_SHARE_WRITE = 2;
    const uint OPEN_ALWAYS = 4;
    const uint OPEN_EXISTING = 3;
    const uint FILE_ATTRIBUTE_NORMAL = 0x80;
    const uint CREATE_NO_WINDOW = 0x08000000;
    const int STARTF_USESTDHANDLES = 0x00000100;
    const uint FILE_END = 2;
    static readonly IntPtr INVALID_HANDLE = new IntPtr(-1);

    static IntPtr OpenAppend(string path) {
        SECURITY_ATTRIBUTES sa = new SECURITY_ATTRIBUTES();
        sa.nLength = Marshal.SizeOf(typeof(SECURITY_ATTRIBUTES));
        sa.bInheritHandle = 1;
        IntPtr h = CreateFile(path, GENERIC_WRITE, FILE_SHARE_READ | FILE_SHARE_WRITE,
            ref sa, OPEN_ALWAYS, FILE_ATTRIBUTE_NORMAL, IntPtr.Zero);
        if (h == INVALID_HANDLE || h == IntPtr.Zero) {
            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "CreateFile " + path);
        }
        SetFilePointerEx(h, 0, IntPtr.Zero, FILE_END);
        return h;
    }

    static IntPtr OpenNulRead() {
        SECURITY_ATTRIBUTES sa = new SECURITY_ATTRIBUTES();
        sa.nLength = Marshal.SizeOf(typeof(SECURITY_ATTRIBUTES));
        sa.bInheritHandle = 1;
        IntPtr h = CreateFile("NUL", GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE,
            ref sa, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, IntPtr.Zero);
        if (h == INVALID_HANDLE || h == IntPtr.Zero) {
            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "CreateFile NUL");
        }
        return h;
    }

    public static int Start(string exe, string arguments, string cwd, string stdoutPath, string stderrPath) {
        bool redirect = !string.IsNullOrEmpty(stdoutPath) || !string.IsNullOrEmpty(stderrPath);
        STARTUPINFO si = new STARTUPINFO();
        si.cb = Marshal.SizeOf(typeof(STARTUPINFO));
        PROCESS_INFORMATION pi;
        IntPtr hIn = IntPtr.Zero;
        IntPtr hOut = IntPtr.Zero;
        IntPtr hErr = IntPtr.Zero;
        try {
            if (redirect) {
                hIn = OpenNulRead();
                hOut = OpenAppend(string.IsNullOrEmpty(stdoutPath) ? "NUL" : stdoutPath);
                hErr = OpenAppend(string.IsNullOrEmpty(stderrPath) ? "NUL" : stderrPath);
                si.dwFlags = STARTF_USESTDHANDLES;
                si.hStdInput = hIn;
                si.hStdOutput = hOut;
                si.hStdError = hErr;
            }
            string cmd = "\"" + exe + "\"";
            if (!string.IsNullOrEmpty(arguments)) {
                cmd = cmd + " " + arguments;
            }
            StringBuilder cl = new StringBuilder(cmd);
            bool ok = CreateProcess(
                exe,
                cl,
                IntPtr.Zero,
                IntPtr.Zero,
                redirect,
                CREATE_NO_WINDOW,
                IntPtr.Zero,
                string.IsNullOrEmpty(cwd) ? null : cwd,
                ref si,
                out pi);
            if (!ok) {
                throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "CreateProcess");
            }
            CloseHandle(pi.hThread);
            CloseHandle(pi.hProcess);
            return pi.dwProcessId;
        } finally {
            if (hIn != IntPtr.Zero) CloseHandle(hIn);
            if (hOut != IntPtr.Zero) CloseHandle(hOut);
            if (hErr != IntPtr.Zero) CloseHandle(hErr);
        }
    }
}
"@
}

function Start-HiddenProcess {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [string]$ArgumentList = "",
        [string]$WorkingDirectory = "",
        [string]$RedirectStandardOutput = "",
        [string]$RedirectStandardError = ""
    )

    if ($FilePath -eq "powershell.exe" -or $FilePath -eq "powershell") {
        $FilePath = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
    }

    $redirectOut = -not [string]::IsNullOrWhiteSpace($RedirectStandardOutput)
    $redirectErr = -not [string]::IsNullOrWhiteSpace($RedirectStandardError)
    if ($redirectOut) {
        $outDir = Split-Path -Parent $RedirectStandardOutput
        if ($outDir -and -not (Test-Path $outDir)) {
            New-Item -ItemType Directory -Path $outDir -Force | Out-Null
        }
        if (-not (Test-Path $RedirectStandardOutput)) {
            New-Item -ItemType File -Path $RedirectStandardOutput -Force | Out-Null
        }
    }
    if ($redirectErr) {
        $errDir = Split-Path -Parent $RedirectStandardError
        if ($errDir -and -not (Test-Path $errDir)) {
            New-Item -ItemType Directory -Path $errDir -Force | Out-Null
        }
        if (-not (Test-Path $RedirectStandardError)) {
            New-Item -ItemType File -Path $RedirectStandardError -Force | Out-Null
        }
    }

    # WT_SESSION on the parent makes a new console attach as a Windows Terminal tab.
    $savedWtSession = $env:WT_SESSION
    $savedWtProfile = $env:WT_PROFILE_ID
    Remove-Item Env:\WT_SESSION -ErrorAction SilentlyContinue
    Remove-Item Env:\WT_PROFILE_ID -ErrorAction SilentlyContinue

    try {
        # ProcessStartInfo carries the same flags we need (UseShellExecute=false,
        # CreateNoWindow). File redirect uses inheritable handles so a short-lived
        # parent can exit without filling a pipe and stalling the child.
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $FilePath
        $psi.Arguments = $ArgumentList
        if ($WorkingDirectory) {
            $psi.WorkingDirectory = $WorkingDirectory
        }
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true

        $childPid = [BlogHiddenProcessNative]::Start(
            $psi.FileName,
            $psi.Arguments,
            $psi.WorkingDirectory,
            $(if ($redirectOut) { $RedirectStandardOutput } else { "" }),
            $(if ($redirectErr) { $RedirectStandardError } else { "" })
        )
        $proc = Get-Process -Id $childPid -ErrorAction SilentlyContinue
        if (-not $proc) {
            throw "Start-HiddenProcess started PID $childPid but Get-Process could not find it"
        }
        return $proc
    } finally {
        if ($null -ne $savedWtSession -and $savedWtSession -ne "") {
            $env:WT_SESSION = $savedWtSession
        }
        if ($null -ne $savedWtProfile -and $savedWtProfile -ne "") {
            $env:WT_PROFILE_ID = $savedWtProfile
        }
    }
}
