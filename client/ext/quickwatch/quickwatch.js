/**
 * quickwatch Module for the Cloud9 IDE
 *
 * @copyright 2010, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
require.def("ext/quickwatch/quickwatch",
    ["core/ide",
     "core/ext",
     "ext/editors/editors",
     "text!ext/quickwatch/quickwatch.xml"],
    function(ide, ext, editors, markup) {

return ext.register("ext/quickwatch/quickwatch", {
    name    : "quickwatch",
    dev     : "Ajax.org",
    type    : ext.GENERAL,
    alone   : true,
    markup  : markup,
    commands : {
        "quickwatch": {hint: "quickly inspect the variable that is under the cursor"}
    },
    hotitems: {},

    nodes   : [],

    hook : function(){
    },

    init : function(amlNode){
        txtCurObject.addEventListener("keydown", function(e){
            if (e.keyCode == 13) {
                if (!this.value.trim())
                    return dgWatch.clear();

                require('ext/console/console').evaluate(this.value);
            }
            else if (e.keyCode == 40 && dgWatch.length) {
                var first = dgWatch.getFirstTraverseNode();
                if (first) {
                    dgWatch.select(first);
                    dgWatch.focus();
                }
            }
        });
        
        var restricted = [38, 40, 36, 35];
        dgWatch.addEventListener("keydown", function(e) {
            if (e.keyCode == 38) {
                if (this.selected == this.getFirstTraverseNode())
                    txtCurObject.focus();
            }
            else if (restricted.indexOf(e.keyCode) == -1) {
                txtCurObject.focus();
            }
        }, true);
    },

    toggleDialog: function(force, exec) {
        ext.initExtension(this);
        
        if (!winQuickWatch.visible || force == 1) {
            var editor = editors.currentEditor;
    
            var sel   = editor.getSelection();
            var doc   = editor.getDocument();
            var range = sel.getRange();
            var value = doc.getTextRange(range);

            if (value) {
                txtCurObject.setValue(value);
                if (exec) {
                    require('ext/console/console').evaluate(value);
                    txtCurObject.focus();
                }
            }

            winQuickWatch.show();
        }
        else
            winQuickWatch.hide();

        return false;
    },

    quickwatch : function(){
        this.toggleDialog(1, true);
    },

    enable : function(){
        this.nodes.each(function(item){
            item.enable();
        });
    },

    disable : function(){
        this.nodes.each(function(item){
            item.disable();
        });
    },

    destroy : function(){
        this.nodes.each(function(item){
            item.destroy(true, true);
        });
        this.nodes = [];
    }
});

});