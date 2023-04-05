@echo off
:: calculate version
for /f "tokens=1-3 delims=." %%i in (version) do (
	set ver1=%%i
	set ver2=%%j
	set ver3=%%k
)
set old_version=%ver1%.%ver2%.%ver3%
echo old version: %old_version%
set /a new_ver3=%ver3%+1
set new_version=%ver1%.%ver2%.%new_ver3%
echo new version: %new_version%
echo %new_version%>version

:: push code
git tag release-v%new_version%
git push --tags

:: build
docker build . --file Dockerfile --tag uswccr.ccs.tencentyun.com/xiaofeng/catoy:release-v%new_version%

:: push
docker push uswccr.ccs.tencentyun.com/xiaofeng/catoy:release-v%new_version%

:: deploy
ssh root@43.153.36.165 "cd ~/catoy; sed -i 's/uswccr.ccs.tencentyun.com\/xiaofeng\/catoy:release-v%old_version%/uswccr.ccs.tencentyun.com\/xiaofeng\/catoy:release-v%new_version%/' docker-compose.yaml; docker-compose down; docker-compose up -d"