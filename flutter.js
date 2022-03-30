function emitcode() {
    window.chrome.webview.postMessage({
        type: "run_code",
        code: Blockly.Python.workspaceToCode(workspace)
    });
}

Blockly.Blocks['import_cf'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("My AutoPylot Starts")
            .appendField(new Blockly.FieldImage("./images/crown.png", 30, 30, { alt: "*", flipRtl: "FALSE" }));
        this.setColour("#000");
        this.setNextStatement(true, null);
        this.setStyle("hat_blocks")
        this.setTooltip("Import ClointFusion");
        this.setDeletable(false);
        this.setEditable(false);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python["import_cf"] = function (block) {
    Blockly.Python.definitions_["ap"] = "import my_autopylot as ap";
    // TODO: Assemble Python into code variable.
    var code = "";
    return code;
};
window.chrome.webview.addEventListener("message", function (message) {
    console.log("message", message.data)
    var msg_data = message.data;
    if (msg_data.type == "set_field_name") {
        workspace.getBlockById(msg_data.block_id).setFieldValue(msg_data.value, msg_data.field_id)
    }
    if (msg_data.type == "set_workspace") {
        var xml = Blockly.Xml.textToDom(msg_data.value);
        Blockly.Xml.domToWorkspace(xml, workspace);

        window.chrome.webview.postMessage({
            message: "start_autosave",
            type: "autosave"
        });

    }
});


function autosave() {
    // let xml_id = '<xml id="workspaceBlocks"'
    let xml = Blockly.Xml.workspaceToDom(workspace);
    complete_xml = Blockly.Xml.domToText(xml);

    Blockly.Python.INFINITE_LOOP_TRAP = null;
    const code = Blockly.Python.workspaceToCode(workspace);
    complete_code = code

    window.chrome.webview.postMessage({
        message: "save_code_blockly",
        type: "autosave",
        code: complete_code,
        workspace: complete_xml,
    });

    setTimeout(autosave, 3000)

}

window.chrome.webview.postMessage({
    message: "initialize_blockly",
});