import Foundation

 @objc(ZeroConf) class ZeroConf : CDVPlugin {
    func greet(command: CDVInvokedUrlCommand) {
        let message = command.arguments[0] as! String
        
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAsString: "Hello \(message)")
        commandDelegate!.sendPluginResult(pluginResult, callbackId:command.callbackId)
    }
}