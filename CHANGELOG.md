# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.6.0"></a>
# [0.6.0](https://github.com/denouche/iot-admin-api/compare/v0.5.0...v0.6.0) (2017-07-02)


### Bug Fixes

* filter versions without firmware on update ([726a749](https://github.com/denouche/iot-admin-api/commit/726a749))
* on remove application, also reset the devices linked to this application ([8b42e1e](https://github.com/denouche/iot-admin-api/commit/8b42e1e))
* on remove version, also reset the devices linked to this version ([2c55e03](https://github.com/denouche/iot-admin-api/commit/2c55e03))


### Features

* add device comment field, and on register to unknown application add a comment to give details about it ([934e100](https://github.com/denouche/iot-admin-api/commit/934e100))
* add hasFirmware field to be informed if a version has a firmware of not without needed to download it ([0bd6f7d](https://github.com/denouche/iot-admin-api/commit/0bd6f7d))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/denouche/iot-admin-api/compare/v0.4.5...v0.5.0) (2017-06-28)


### Features

* allow to search device with empty application, version, or thing id, to be able to get the list of devices without applicatino, version, or thing ([0dd4000](https://github.com/denouche/iot-admin-api/commit/0dd4000))



<a name="0.4.5"></a>
## [0.4.5](https://github.com/denouche/iot-admin-api/compare/v0.4.4...v0.4.5) (2017-06-27)



<a name="0.4.4"></a>
## [0.4.4](https://github.com/denouche/iot-admin-api/compare/v0.4.3...v0.4.4) (2017-06-25)


### Bug Fixes

* **register:** on unknown application, do not create the application, to avoid to recreate old application on rename app ([d664ef3](https://github.com/denouche/iot-admin-api/commit/d664ef3))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/denouche/iot-admin-api/compare/v0.4.2...v0.4.3) (2017-06-22)


### Bug Fixes

* remove suffix for API, let users handle it in webserver configuration ([cb4316a](https://github.com/denouche/iot-admin-api/commit/cb4316a))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/denouche/iot-admin-api/compare/v0.4.1...v0.4.2) (2017-06-22)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/denouche/iot-admin-api/compare/v0.4.0...v0.4.1) (2017-06-20)


### Bug Fixes

* on printing device, remove version useless fields ([94d2368](https://github.com/denouche/iot-admin-api/commit/94d2368))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/denouche/iot-admin-api/compare/v0.3.2...v0.4.0) (2017-06-20)


### Bug Fixes

* **download:** check application/version exists and the version is not the most recent ([f907aa8](https://github.com/denouche/iot-admin-api/commit/f907aa8))


### Features

* on register, if application or version does not exist, create it ([e0e69e0](https://github.com/denouche/iot-admin-api/commit/e0e69e0))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/denouche/iot-admin-api/compare/v0.3.1...v0.3.2) (2017-06-19)


### Bug Fixes

* in case of first creation of version there is no comparison to check the new version is greater than the previous one ([7b989aa](https://github.com/denouche/iot-admin-api/commit/7b989aa))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/denouche/iot-admin-api/compare/v0.3.0...v0.3.1) (2017-06-19)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/denouche/iot-admin-api/compare/v0.2.2...v0.3.0) (2017-06-19)


### Features

* register is now an admin protected route. ([1192e93](https://github.com/denouche/iot-admin-api/commit/1192e93))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/denouche/iot-admin-api/compare/v0.2.1...v0.2.2) (2017-06-18)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/denouche/iot-admin-api/compare/v0.2.0...v0.2.1) (2017-06-17)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/denouche/iot-admin-api/compare/v0.1.4...v0.2.0) (2017-06-17)
