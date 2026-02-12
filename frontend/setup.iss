[Setup]
AppName=My React App
AppVersion=1.0.0
DefaultDirName={pf}\MyReactApp
DefaultGroupName=My React App
OutputDir=output
OutputBaseFilename=MyReactAppSetup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Files]
Source: "build\*"; DestDir: "{app}\web"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\My React App"; Filename: "{app}\web\index.html"
Name: "{commondesktop}\My React App"; Filename: "{app}\web\index.html"

[Run]
Filename: "{app}\web\index.html"; Description: "Launch My React App"; Flags: postinstall shellexec skipifsilent
