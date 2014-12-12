DropdownTree
============

生成下拉树的一个js类

实现思路请参考<a href="http://www.cnblogs.com/neverstop/archive/2012/04/28/2475438.html" target="_blank">在javascript中以数组链表法实现下拉树</a>

在网页开发中，大部分的下拉菜单都是一行一项并且上下对齐，这样虽然很好但是缺乏层次结构感，客户不知道各个选项之间的关系，
因此有的时候我们需要在下拉菜单中以树形结构展示下拉项，给客户更好的体验。比如：假设数据库中有张表存放了中国省市信息，
那么通过DropdownTree.js可以将下拉框做成如下效果，具体请参考example.html示例文件。

使用方法：    
1：引入类库(jquery其实使用的很少，以后考虑完全去掉)     

    <script type="text/javascript" src="jquery-1.7.2.min.js"></script>  
    <script type="text/javascript" src="dropdownTree.js"></script>   
    
2：生成数据，每条数据需要有"id","parentId"和"name"属性，name就是显示的内容。数据的生成根据具体业务通过后台自行生成，该类库只负责数据的处理与展示，下面是生成后的示例数据：    

    var array3 = [
    		{id:0,parentId:-1,name:"《Mongodb权威指南》"},
    		{id:1,parentId:0,name:"第1章 简介"},
    		{id:11,parentId:1,name:"1.1 丰富的数据模型"},
    		{id:12,parentId:1,name:"1.2 容易扩展"},
    		{id:13,parentId:1,name:"1.3 不牺牲速度"},
    		{id:14,parentId:1,name:"1.4 简便的管理"},
    		{id:15,parentId:1,name:"1.5 其他内容"}
    	];

3：生成树形结构    

    var tree = DropdownTree(array3,"输入框ID","显示树形结构的元素id");    
其实不仅可以用在下拉树上，如果网页中需要显示树形结构（比如：书或文章的目录），也可以使用该类库。  

![image](https://github.com/zjh-neverstop/DropdownTree/blob/master/images/result.png)    


