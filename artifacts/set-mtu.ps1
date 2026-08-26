Set-NetIPInterface -InterfaceIndex 10 -AddressFamily IPv4 -NlMtu 1400
Set-NetIPInterface -InterfaceIndex 7 -AddressFamily IPv4 -NlMtu 1400
$if10 = (Get-NetIPInterface -InterfaceIndex 10 -AddressFamily IPv4).NlMtu
$if7 = (Get-NetIPInterface -InterfaceIndex 7 -AddressFamily IPv4).NlMtu
"if10=$if10; if7=$if7" | Out-File "E:\AI Projects\data-insights-blog\artifacts\mtu-set-result.txt" -Encoding ascii
