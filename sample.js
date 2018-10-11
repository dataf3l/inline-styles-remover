// inline style remover (naive version)
// remove inline styles
var classes = {};
function sort_object_keys(obj){
    var keys = Object.keys(obj);
    var sorted = keys.sort();
    var out={}
    for(var s of sorted){
        out[s]=obj[s];
    }
    return out;
}
// solves duplicate classes.
function node2properties(node){
    var s = node.getAttribute("style");
    if(s == null){
        return {};
    }
    var p = s.split(";");
    var out = {};
    for(var prop in p){
        var parts = p[prop].split(":");
        out[parts[0]] = parts[1];
    }
    return out;
}

function object2hash(properties){
    var sorted = sort_object_keys(properties);
    var hash = "";
    for(var p in properties){
        hash += p+":"+properties[p]+";"
    }
    return hash;
}
var g_class_counter = 0;
function classNameCreator(style){
	g_class_counter++;
	return "class"+g_class_counter

}
// recursively remove the inline styles
// of a function, because, inline style suck.

function removeAndPrintInlineStyles(node){//f 
    //console.log(node.getAttribute("style"));
    if(node.getAttribute("style")!=null){
        let properties = node2properties(node);
        let hash = object2hash(properties);
        let className = "ERR"; 
        if(!(hash in classes)){
            //add
            classes[hash] = classNameCreator();
        }
        className = classes[hash];
        node.removeAttribute("style"); //remove style.
        node.className = className;
    }
    for(var child of node.children){
        removeAndPrintInlineStyles(child);
    }    

}
function getFixedCode(node){
    g_class_counter = 0;
    classes = {};
    removeAndPrintInlineStyles(node);
    var x = "";
    x += "<style>\n";
    for(var rule in classes){
        var formattedRules = rule.replace(";",";\n\t");
        var className = classes[rule];
        x+="."+className+"{\n\t" + formattedRules + "\n}\n\n";
    }
    x += "</style>\n";
    var y = node.innerHTML;
    return x+y;

}
function init(){
    var n = document.getElementById("name");
    removeAndPrintInlineStyles(n);
    var x = "";
    x += "<style>\n";
    for(var rule in classes){
        var formattedRules = rule.replace(";",";\n\t");
        var className = classes[rule];
        x+="."+className+"{\n\t" + formattedRules + "\n}\n\n";
    }
    x += "</style>\n";
    var y = document.getElementById("name").outerHTML;
    //console.log(x+y);
    return x+y;
}
function fixCode(){
	var c = document.getElementById("left").value;
	var hidden = document.getElementById("hidden");
	hidden.innerHTML = c;
	var result = getFixedCode(hidden);
        document.getElementById("right").value = result;
	
}
window.onload = init;
