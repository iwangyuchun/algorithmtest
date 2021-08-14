该文档结合之前的需求文档编写，参考需求文档一起看
## 树形布局
`TreeLayoutClass.h`文件中声明了树形布局的所有的方法。`ThreeLayoutClass.cpp`文件中对所有声明的方法进行了实现。
```C++
#include "TreeLayoutClass.h"
TreeLayoutClass treeLayout;
str=treeLayout.layout(nodes, links, pam);
```
正常情况下，只需要创建`TreeLayoutClass`对象，并调用`layout(nodes,links,pam)`方法即可,该方法会接收三个参数，`nodes`,`links`的类型分别为`vector<Node>`,`vector<Link>`。`Node`对象和`Link`对象在`Node.h`和`Link.h`中予以声明。`layout`方法的返回值为`Json`序列化的`string`类型,如果想获取的返回值不是`string`类型，可以再调用`layout`方法后，另外调用`exportNodes`和`exportLinks`这两个方法分别返回`vector<Node*>`和`vector<Link*>`。对于参数`pam`其声明可以再`LayoutParams.h`中查看，此文件也对其他布局中所欲要的参数进行了详细的声明。
## 桑吉图
`LevelLayoutClass.h`文件中声明了桑吉布局的所有的方法。`LevelLayoutClass.cpp`文件中对所有声明的方法进行了实现。
```C++
#include "LevelLayoutClass.h"
LevelLayoutClass levelLayoutClass;
str = levelLayoutClass.layout(nodes, links,pam);
```
正常情况下，只需要创建`LevelLayoutClass`对象，并调用`layout(nodes,links,pam)`方法即可,该方法会接收三个参数，`nodes`,`links`的类型分别为`vector<Node>`,`vector<Link>`。`Node`对象和`Link`对象在`Node.h`和`Link.h`中予以声明。`layout`方法的返回值为`Json`序列化的`string`类型,如果想获取的返回值不是`string`类型，可以再调用`layout`方法后，另外调用`exportNodes`和`exportLinks`这两个方法分别返回`vector<Node*>`和`vector<Link*>`。对于参数`pam`其声明可以再`LayoutParams.h`中查看，此文件也对其他布局中所欲要的参数进行了详细的声明。
## 力导布局
```C++
#include "force.cpp"
#include "FDP.h"
 map<string, int> indexById;
int nodeLength = nodes.size();
for (int i = 0; i < nodeLength; i++) {
     indexById.insert(pair<string,int>(nodes[i].id, i));
}
int linkLength = links.size(); 
for (int j = 0; j < linkLength; j++) {
     //将from 和to 转换为 soure 和 target
     links[j].source = indexById.find(links[j].from)->second;
     links[j].target = indexById.find(links[j].to)->second;
}
FDP(nodes, links, nodes.size(), links.size(), 0, 1, pam.electricalCharge, pam.springStiffness, pam.springLength, pam.maxIterations, pam.infinityDistance, pam.viewSize[0], pam.viewSize[1],pam.nodeSpacing);
 //compute link's position according to soure node and target node
for (int j = 0; j < linkLength; j++) {
    links[j].fromPosition[0] = nodes[sourceNodeIndex].x;
    links[j].fromPosition[1] = nodes[sourceNodeIndex].y;
    links[j].toPosition[0] = nodes[targetNodeIndex].x;
    links[j].toPosition[1] = nodes[targetNodeIndex].y;
 }
 //serialize node and link to json str
str = jsonClass.ObjectToJsonForce(nodes, links)
```
对于力导布局，调用`FDP()`传入对应的参数即可，参数的详细解释在`FDP.cpp`中有详细说明,使用之前要确保`link`使用的是`source`,`target`而不是`from`,`to`作为源节点和目标结点,另外在布局过程中并不关系`link`的具体的位置，需要在布局结束后需要自己进行构建,`jsonClass.ObjectToJsonForce(nodes, links)`函数可以将力导布局过后的`node``link`序列化为`json`格式。
## 圆形布局
```C++
//格式转换将vector<node>,vector<link>转换为vector<Node*>vector<Link*>
#include "circular.h"
vector<Node*> cirNodes;
vector<Link*> cirLinks;
for (int i = 0; i < nodes.size(); i++) {
    Node* cirNode = new Node();
    Node temp = nodes[i];
    cirNode->id = temp.id;
    cirNodes.push_back(cirNode);
}
for (int i = 0; i < links.size(); i++)
{
    Link* cirLink = new Link();
    Link temp = links[i];
    cirLink->from = links[i].from;
    cirLink->to = links[i].to;
    cirLink->value = links[i].value;
    cirLinks.push_back(cirLink);
}
circular cirLayout;
double minView = min(pam.viewSize[0], pam.viewSize[1]);
//调用圆形布局
cirLayout.run(cirLinks, cirNodes, pam.radius, pam.spacing, minView, pam.startAngle, pam.circleDirection);
JSONClass jsonClass;
 //序列化为json string
str = jsonClass.ObjectToJson(cirNodes,cirLinks);
```
对于圆形布局于其它布局方法类似，在这里就不进行详细解释。
## JsonClass
`JsonClass` 为工具类，主要用来将对象序列化为`JSON`格式或者将`JSON`反序列化为`Node`和`Link`对象
## httplib
`httplib`用来搭建http sercer 方便远程主机使用算法,其中在`main.cpp`中监听了`8989`端口,并对`/pos`路由进行了处理。