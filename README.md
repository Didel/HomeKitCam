# HomeKitCam
A project to make a Raspberry Pi driven, HomeKit Enabled camera.

His project aims to use make a HomeKit enabled camera with a Raspberry Pi and the Raspberry Camera Module. The software is built on the HAP-NodeJS HomeKit API.

To install, clone the project into a folder. Then cd to that directory, and run npm install to install all the necessary packages.

The camera can be run by running the command: node PiCameraAccesory.js 

On any iOS 10 device, open the Home app and add a new accessory. The Raspberry should show up as 'Pi Camera'. When asked to scan the HomeKit accessory code, choose to manually enter a code and enter xxx. After that, the pairing should be successful and the camera should start to send screenshots to the Home app.