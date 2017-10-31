// https://gist.github.com/ephemer/b65d379d5a96237d186d

// This file to be added to the <platform name="ios"> tag of your plugin.xml like this:
// <hook type="after_plugin_install" src="hooks/addSwiftOptions.js" />

var fs = require("fs");
var path = require("path");

module.exports = function (context) {
  var xcode =context.requireCordovaModule('xcode');
  var Q =context.requireCordovaModule('q');
  var shell =context.requireCordovaModule('shelljs');
  
  console.log(context.opts);
  
	var projectRoot = context.opts.projectRoot;
	var xcconfigPath = projectRoot + "/platforms/ios/cordova/build.xcconfig";

	var pluginDir = context.opts.plugin.dir;
	var srcDir = pluginDir + "/src/ios/";

	var swiftOptions = [];
  
  swiftOptions.push('');
	//swiftOptions.push('IPHONEOS_DEPLOYMENT_TARGET = 7.0');
	//swiftOptions.push('SWIFT_OBJC_BRIDGING_HEADER = $(PROJECT_NAME)/Plugins/' + context.opts.plugin.id + '/Bridging-Header.h');
	//swiftOptions.push('LD_RUNPATH_SEARCH_PATHS = $(inherited) @executable_path/Frameworks');
  swiftOptions.push('#include "../$(PROJECT_NAME)/Plugins/' + context.opts.plugin.id + '/ZeroConf.xcconfig"');
  swiftOptions.push('');

	fs.appendFileSync(xcconfigPath, swiftOptions.join('\n'));
  
  function findXCodeProjectIn(projectPath) {
    // 'Searching for Xcode project in ' + projectPath);
    var xcodeProjFiles = shell.ls(projectPath).filter(function (name) {
        return path.extname(name) === '.xcodeproj';
    });
    
    if (xcodeProjFiles.length === 0) {
        return Q.reject('No Xcode project found in ' + projectPath);
    }
    if (xcodeProjFiles.length > 1) {
        console.warn('Found multiple .xcodeproj directories in \n' +
            projectPath + '\nUsing first one');
    }

    var projectName = path.basename(xcodeProjFiles[0], '.xcodeproj');
    return Q.resolve(projectName);
  }
}