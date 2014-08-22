/**
 * Created by 赵晶浩 on 14-8-21.
 */


var DropdownTree = (function(){

    /**
     * 定义字符串常量，图标名称
     */
    var L = "L.png";
    var T = "T.png";
    var LMINUS = "Lminus.png";
    var TMINUS = "Tminus.png";
    var LPLUS = "Lplus.png";
    var TPLUS = "Tplus.png";
    var FOLDERICON = "foldericon.png";
    var OPENFOLDERICON = "openfoldericon.png";

    var level = 0;

    /**
     * 计算div的偏移量
     * @param obj
     * @returns {{left: (Number|number), top: (Number|number)}}
     */
    var getOffset = function(obj) {
        var x = obj.offsetLeft || 0;
        var y = obj.offsetTop || 0;
        var temp = obj;
        while (temp.offsetParent) {
            temp = temp.offsetParent;
            x += temp.offsetLeft;
            y += temp.offsetTop;
        }
        //alert("x:"+x+" y:"+y);
        return { left: x, top: y };
    };

    /**
     * 将tagetDiv定位到sourceDiv下方，与sourceDic左对齐，宽度一致
     * @param sourceDiv
     * @param targetDiv
     */
    var positionDiv = function(sourceDiv, targetDiv) {
        var obj = document.getElementById(sourceDiv);
        var xy = getOffset(obj);
        $("#" + targetDiv).css("left", xy.left);
        $("#" + targetDiv).css("width", $("#" + sourceDiv).outerWidth());
        $("#" + targetDiv).css("top", (xy.top + $("#" + sourceDiv).outerHeight()));

    };

    /**
     * 给js数组添加获取元素索引的原型方法
     * @param array 数组
     * @param obj 元素
     * @returns {number} 返回元素obj在数组array中的索引
     */
    Array.prototype.indexOf = function(array,obj){
        for(var i=0; i< array.length; i++){
            if(array[i].id == obj){
                return i;
            }
        }
        return -1;
    };

    /**
     * 计算数组中每个对象所在的层数level，并为其添加level属性。level的值从1开始，即：根节点为第一层，rootNode.level = 1
     * @param obj
     */
    var initLevel = function(obj){
        for(var i=0; i<obj.array.length;i++)
        {
            level = 0;  //计算每个节点的层次之前，先重置为0
            getLevel(obj,i);
            obj.array[i].level = level;
        }
    };

    /**
     * 计算树中每个节点的层号，根节点的层号为1
     * @param obj
     * @param id
     * @returns {boolean}
     */
    var getLevel = function (obj,id)
    {
        if(!Boolean(obj.array[id]))
        {
            return false;
        }

        if(obj.array[id].id!="-1")
        {
            level = level + 1;
            getLevel(obj,obj.array.indexOf(obj.array,obj.array[id].parentId));
        }

    };

    /**
     * 对象数组array按照propertyName属性从小到大排序的方法
     * @param propertyName
     * @returns {Function}
     */
    var compare =function (propertyName1,propertyName2)
    {
        return function (object1,object2){
            var value1 = parseInt(object1[propertyName1]);
            var value2 = parseInt(object2[propertyName1]);
            var value3 = parseInt(object1[propertyName2]);
            var value4 = parseInt(object2[propertyName2]);
            if(value1>value2){
                return 1;
            }else if(value1==value2){
                if(value3>value4){
                    return 1;
                }
                else {
                    return -1;
                }
            }else
                return -1;
        }
    };

    /**
     * 初始化抽象树，处理根节点；如果是多棵树，将所有树的根结点放入全局数组array_1中
     */
    var initAbstructTree = function (obj)
    {
        var rootCount = 0;
        //array_1为全局变量
        var treeArray = new Array(1);
        for(var i=0;i<obj.array.length;i++)
        {
            if(obj.array[i].level == 1)
            {
                treeArray[rootCount] = obj.array[i];
                rootCount++;
            }
            else
                continue;
        }
        return treeArray;
    };

    /**
     * 创建抽象树，用递归的方式处理根结点以外的所有节点，以数组的形式建立树形结构
     * @param obj
     * @param treeArray
     */
    var createAbstructTree = function (obj,treeArray)
    {
        //layer保存本次需要搜索array数组中的哪一层,即：当前处理的层号
        var layer = treeArray[0].level + 1;
        if(layer>obj.array[obj.array.length-1].level)
            return;

        for(var i=0;i<treeArray.length;i++)
        {
            for(var j=0;j<obj.array.length;j++)
            {
                if(obj.array[j].level>layer)
                    break;
                if(obj.array[j].level == layer&&obj.array[j].parentId == treeArray[i].id)
                {
                    if(!Boolean(treeArray[i].array))
                    {
                        treeArray[i].array = new Array();
                    }
                    treeArray[i].array.push(obj.array[j]);
                }
            }
            if(Boolean(treeArray[i].array))
            {
                createAbstructTree(obj,treeArray[i].array);
            }

        }
    };

    /**
     * 按照数组中保存的抽象树形结构，递归生成树形结构的html
     * @param obj
     * @param treeArray
     * @param signalArray
     */
    var generateTreeHtml = function (obj,treeArray,signalArray)
    {
        //alert(treeArray[6].level);
        for(var i=0;i<treeArray.length;i++)
        {
            if(treeArray[i].level == 1)   //根节点
            {
                if(i == (treeArray.length-1)) //第一层的最后一个节点的图标不一样
                {
                    obj.html += "<div><div id='level"+treeArray[i].level+"_"+treeArray[i].id+"'><img src=\"images/"+LMINUS+"\"><img src=\"images/"+OPENFOLDERICON+"\"><span>"+treeArray[i].name+"</span></div>";
                }
                else
                    obj.html += "<div><div id='level"+treeArray[i].level+"_"+treeArray[i].id+"'><img src=\"images/"+TMINUS+"\"><img src=\"images/"+OPENFOLDERICON+"\"><span>"+treeArray[i].name+"</span></div>";

                //控制标签的显示，如果有子节点，则将所有的子节点放在<div>标签里面
                if(Boolean(treeArray[i].array))
                {
                    obj.html += "<div>"
                }

                if(i == (treeArray.length-1))
                {
                    if(Boolean(treeArray[i].array))  //有子节点
                    {
                        signalArray.push("blank");
                        generateTreeHtml(obj,treeArray[i].array,signalArray);
                        signalArray.pop();
                    }

                }
                else
                {
                    if(Boolean(treeArray[i].array))  //有子节点
                    {
                        signalArray.push("I");
                        generateTreeHtml(obj,treeArray[i].array,signalArray);
                        signalArray.pop();
                    }

                }

                if(Boolean(treeArray[i].array))
                {
                    obj.html += "</div></div>"; //结束标签
                }
                else
                    obj.html += "</div>"; //结束标签
            }
            else    //非根节点
            {
                //添加对应的外层图片
                var outerbiaoqian="";
                var innerbiaoqian="";
                if(signalArray.length>0)
                {

                    for(var k=0; k<signalArray.length;k++)
                    {
                        outerbiaoqian += "<img src='images/"+signalArray[k]+".png'>"
                    }
                }

                //添加自己的图片
                if(i == treeArray.length-1) //最后一个节点
                {
                    if(Boolean(treeArray[i].array))
                    {
                        //并且有子节点
                        innerbiaoqian+="<img src='images/"+LMINUS+"'><img src='images/"+OPENFOLDERICON+"'>";
                        //signalArray.push("blank");
                    }
                    else
                    {
                        //没有子节点
                        innerbiaoqian+="<img src='images/"+L+"'>";
                        //signalArray.push("blank");
                    }

                }
                else  //不是最后一个节点
                {
                    if(Boolean(treeArray[i].array))
                    {
                        //并且有子节点
                        innerbiaoqian+="<img src='images/"+TMINUS+"'><img src='images/"+OPENFOLDERICON+"'>";
                    }
                    else
                    {
                        //没有子节点
                        innerbiaoqian+="<img src='images/"+T+"'>";
                    }

                }


                if(Boolean(treeArray[i].array))  //有子节点
                {
                    obj.html += "<div id='level"+treeArray[i].level+"_"+treeArray[i].id+"'>"+outerbiaoqian+innerbiaoqian+"<span>"+treeArray[i].name+"</span></div><div>";
                    if(i == treeArray.length-1) //最后一个节点
                    {
                        signalArray.push("blank");
                    }
                    else
                        signalArray.push("I");
                    generateTreeHtml(obj,treeArray[i].array,signalArray);
                    signalArray.pop();
                    obj.html += "</div>";
                }
                else   //没有子节点
                    obj.html += "<div id='level"+treeArray[i].level+"_"+treeArray[i].id+"'>"+outerbiaoqian+innerbiaoqian+"<span>"+treeArray[i].name+"</span></div>";

            }
        }
    };

    /**
     * 创建出树形结构以后，给树增加一些事件和样式
     */
    var tree_additionalFunction = function(obj)
    {
        //添加鼠标经过时的样式
        $("div[id^=level]").hover(function(){
            $(this).addClass("item_hover");
        },function(){
            $(this).removeClass("item_hover");
        });

        //点击结点时获取结点的值，然后使树不可见
        $("div[id^=level]").click(function(){

            $("#"+obj.controlID).val($(this).find("span").text());
            $("#"+obj.treeDivId).slideUp();
        });

        //展开和收起结点时替换相应的图标
        $("div[id^=level]>img").click(function(){
            if(this.nodeName == "IMG")
            {
                var temp = this.src.split('/');
                var index = temp.length-1;

                if(temp[index] == TMINUS || temp[index] == LMINUS)
                {
                    //左边的表达式先去掉路径中最后一个值，即：要被替换的图片名
                    temp.pop() == TMINUS?this.src = temp.join('/')+"/"+TPLUS:this.src = temp.join('/')+"/"+LPLUS;

                    //替换文件夹图标
                    $(this).next().attr("src",temp.join('/')+"/"+FOLDERICON);

                    $(this).parent().next().slideUp();
                    return false;
                }
                else if(temp[index] == TPLUS || temp[index] == LPLUS)
                {
                    //左边的表达式先去掉路径中最后一个值，即：要被替换的图片名
                    temp.pop() == TPLUS?this.src = temp.join('/')+"/"+TMINUS:this.src = temp.join('/')+"/"+LMINUS;

                    //替换文件夹图标
                    $(this).next().attr("src",temp.join('/')+"/"+OPENFOLDERICON);

                    $(this).parent().next().slideDown();
                    return false;
                }
            }
        });
    };

    var bindEvent = function(obj){
        //处理输入框的点击事件
        $("#"+obj.controlID).click(function(){
            if(!obj.success)
            {
                //treeHandler.createTree(array,this.id);
                obj.createTree();
            }
            else {
                if($("#"+obj.treeDivId).css("display") == "none"){
                    $("#"+obj.treeDivId).html(obj.html);
                    tree_additionalFunction(obj);
                }

//					$("#"+obj.treeDivId).find("div").each(function(){
//						$(this).show();
//					});
            }

            $("#"+obj.treeDivId).slideDown();

            return false;
        });

        //点击页面时，隐藏下拉树
        $(document).click(function(){
            $("#"+obj.treeDivId).slideUp();
        });

        //点击下拉树时，不隐藏，并阻止事件冒泡，不然的话body接收到事件会隐藏掉下拉树
        $("#"+obj.treeDivId).click(function(e){
            if(window.event)
                return false;
            else
                e.stopPropagation();
        });
    };

    /**
     * 下拉树类的构造函数
     * @param array 下拉树展示的数据，必须符合属性的层次结构，这里采用的是“双亲表示法”
     * @param controlId
     * @param treeDivId
     */
    var dropdownTree = function(array,controlId,treeDivId){
        this.success = false; //标识树形结构是否已经创建成功
        this.html = "";  //保存生成的树形结构html
        this.controlID = controlId;
        this.treeDivId = treeDivId;
        this.array = array;
        bindEvent(this);
    };

    /**
     * 原型方法扩展，调用此方法创建树形结构，在这个方法里依次调用上面的方法完成树的创建
     * @type {{}}
     */
    dropdownTree.prototype.createTree = function(){
        if(this.array instanceof Array && this.array.length > 0){
            initLevel(this); //add property named level to all the object
            this.array.sort(compare("level","id")); //sort the array according to the object's property of level
            var treeArray = initAbstructTree(this);
            createAbstructTree(this,treeArray); //执行完这个方法后，数组array_1就保存了树形结构的信息
            var signalArray = new Array();//图标数组
            generateTreeHtml(this,treeArray,signalArray);
            $("#"+this.treeDivId).html(this.html);
            this.success = true;
            tree_additionalFunction(this);
            //调整结果div的宽度并定位
            positionDiv(this.controlID, this.treeDivId);
        }
    };

    /**
     * 工厂方法
     */
    return function(array,controlId,treeDivId){
        return new dropdownTree(array,controlId,treeDivId);
    };

})();
