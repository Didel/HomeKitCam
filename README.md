# HomeKitCam
A project to make a Raspberry Pi driven, HomeKit Enabled camera.

This project aims to make a simple DIY HomeKit enabled camera using only a Raspberry Pi and the Raspberry Camera Module. The software is based on the [HAP-NodeJS](https://github.com/KhaosT/HAP-NodeJS) HomeKit API by [KhaosT](https://github.com/KhaosT).

## Requirements
One of the aims of this project is to be as simple as possible. You will only need:

- A working Raspberry Pi (the newer, the better), configured with a standard [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) installation
- A [Pi Camera Module](https://www.raspberrypi.org/products/camera-module-v2/)
- A suitable usb power adapter to power the Pi

## Installation
To install, clone the project into a folder. Then cd to that directory, and run npm install to install all the necessary packages.

## Starting HomeKitCaM
The camera can be run by running the command: node PiCamera_accesory.js 

On any iOS 10 device, open the Home app and add a new accessory. The Raspberry should show up as 'Pi Camera'. When asked to scan the HomeKit accessory code, choose to manually enter a code and enter `031-45-154`. After that, the pairing should be successful and the camera should start to send screenshots to the Home app.
