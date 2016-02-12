gulp-php-dev-toolbox
--
There are a lot of tools available all with different settings and command line arguments. It makes live a lot easier if all these tasks can be done automatically when the code changes, before a commit. This toolbox contains automated tasks to install dependencies, checking code styling and structure and running unit tests with or without code coverage.

The toolbox uses [gulp](http://gulpjs.com/) as the task runner. Gulp is using [nodejs](https://nodejs.org/en/) as a engine. This way gulp has the ability to run tasks async which will increase the speed off your tasks. If you really need to run the task in sync it's still possible. See the [gulp api documentation](https://github.com/gulpjs/gulp/blob/master/docs/API.md) for more information. Tasks in gulp are created by code and not by configuration. This makes it a lot easier to read and all the tools that are available for [nodejs](https://nodejs.org/en/) are at your disposal for creating tasks.

# Requirements
To make use of this toolbox [nodejs](https://nodejs.org/en/) and gulp are required. Gulp will be installed by the toolbox itself. Nodejs can be [downloaded](https://nodejs.org/en/download/) or installed using a [package manager](https://nodejs.org/en/download/package-manager/).

# Setup
There are multiple ways to setup and use the toolbox. The php tools can be added as a dev dependency in your composer.json of your project or your can use the toolbox in a separate repository.

## Install as composer dev dependency
The most easy one is using composer. Add this repository as a dependency to the composer.json file.
Composer will not automatically call scripts from dependencies. To setup the toolbox in your project you have to call the setup-php-toolbox script in the toolbox from the project root.

```bash
composer require --dev rregeer/gulp-php-dev-toolbox
composer install
vendor/bin/setup-php-toolbox
```

## Install it manually by using git
Just clone the git repository and start the setup script. The setup script will copy the toolbox to the given destination directory. If you want it to be a part of your project use your project root. The second argument of the setup script is the source directory of the toolbox.
```bash
git clone git://github.com/richardregeer/gulp-php-dev-toolbox.git
cd gulp-php-dev-toolbox
bin/setup-php-toolbox <path/to/destination> ./
cd <path/to/destination>
```

<!-- If you just want to install it in the dev-toolbox directory itself, you can also directly call npm install.
```bash
git clone git://github.com/richardregeer/gulp-php-dev-toolbox.git
cd gulp-php-dev-toolbox
npm install
npm install gulp -g
gulp composer:install
``` -->

# Available tasks
To see all the available tasks
```bash
gulp help
```
The task are using gulp plugins to call various php tools like [phpunit](https://phpunit.de/), [php code sniffer](https://github.com/squizlabs/PHP_CodeSniffer), [php mess detector](http://phpmd.org/), [php copy / paste detector](https://github.com/sebastianbergmann/phpcpd), [composer](https://getcomposer.org/), [phplint](http://www.icosaedro.it/phplint/), [php code beautifier](https://github.com/squizlabs/PHP_CodeSniffer/wiki/Fixing-Errors-Automatically)
The available tasks will be listed with a description and available arguments or aliases.

If no task name is given the **default task** will be executed. This will start all the most used tasks. Currently this is composer, tests and check code styling.

# Configuration
For the most php tools there's a configuration file is available to setup the tool (like phpunit.dist.xml). If the tool has a configuration file available it will be mandatory to use and **should be available in your project root**. The task will fail if the configuration file is not found.

Tasks that don't have a configuration file available have a default configuration and can be overridden by using command line arguments or the **dev-toolbox.config.json**. The tasks always use the tools that are installed locally by your composers dependencies. If composer has not installed the required tool, it will always be installed before the task will run. The tools can be found in **vendor/bin** in your project root.

## dev-toolbox.config.json
The toolbox has a configuration file that can be used to configure the toolbox and the tasks.

### tasks
Instead of setting the source of the task as a command line argument using *--source=<path/**/*.php>* for example. You can set it directly in the configuration. This why you can start multiple task with different sources and also don't have to pass the source argument every time you want to execute the task.

**Example:**
```json
{
  "tasks": {
    "style:syntax": {
      "source": ["Library/**/*.php", "UnitTests/**/*.php"]
    },
    "structure:duplication": {
      "source": ["Library/**/*.php"]
    },
    "structure:complexity": {
      "source": ["Library/"]
    }
  }
}
```

<!-- ### projectRoot
The project root can also be changed. This can be used if you don't want that the toolbox is a part of your project for example.
The working directory must be the toolbox else the gulp task runner can't find the main gulp file.

**Example:**
```json
{
  "projectRoot": "/development/php/hello-world-project"
}
``` -->
