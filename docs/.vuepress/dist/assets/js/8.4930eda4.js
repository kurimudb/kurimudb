(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{381:function(t,a,s){t.exports=s.p+"assets/img/illu.ca8c68a2.jpg"},402:function(t,a,s){"use strict";s.r(a);var n=s(43),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"介绍"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#介绍"}},[t._v("#")]),t._v(" 介绍")]),t._v(" "),n("p",[n("img",{attrs:{src:"https://img.shields.io/github/forks/akirarika/kurimudb",alt:""}}),t._v(" "),n("img",{attrs:{src:"https://img.shields.io/github/stars/akirarika/kurimudb",alt:""}}),t._v(" "),n("img",{attrs:{src:"https://img.shields.io/badge/language-javascript-orange.svg",alt:""}}),t._v(" "),n("img",{attrs:{src:"https://img.shields.io/github/license/akirarika/kurimudb",alt:""}})]),t._v(" "),n("h2",{attrs:{id:"kurimudb-是什么"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#kurimudb-是什么"}},[t._v("#")]),t._v(" Kurimudb 是什么")]),t._v(" "),n("p",[n("img",{staticStyle:{"margin-top":"-32px",width:"240px",float:"right"},attrs:{src:s(381)}})]),t._v(" "),n("p",[t._v("Kurimudb 是一款渐进式的 "),n("strong",[t._v("Web 数据仓库")]),t._v("，可以帮你将数据存储在 Memory、LocalStorage 或 IndexedDB 里，并可订阅其值的更新。")]),t._v(" "),n("p",[t._v("除了持久化数据之外，若你愿意，Kurimudb 还能成为你应用的 "),n("a",{attrs:{href:"https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel#Components_of_MVVM_pattern",target:"_blank",rel:"noopener noreferrer"}},[t._v("Model 层"),n("OutboundLink")],1),t._v(" 抽象，然后接任你应用中状态管理库的职责 (诸如 Vuex、Redux、Mobx)，并使你应用真正拥有单一数据来源。")]),t._v(" "),n("p",[t._v("Kurimudb 是驱动化的，这意味着你可以不更改代码的情况下更换具体实现。其中订阅更新功能，内置了 "),n("code",[t._v("Rxjs")]),t._v(" 一种驱动；持久化功能，内置了 "),n("code",[t._v("LocalStorage")]),t._v(" 和 "),n("code",[t._v("Dexie (IndexedDB)")]),t._v(" 两种驱动，并计划新增 "),n("code",[t._v("Cookie")]),t._v(" 驱动。如果不满足你的需求，你也可以编写自己的驱动实现。")]),t._v(" "),n("h2",{attrs:{id:"快速体验"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#快速体验"}},[t._v("#")]),t._v(" 快速体验")]),t._v(" "),n("p",[t._v("安装此 NPM 包，无需任何配置，你就可以快速体验 Kurimudb 啦！")]),t._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" i kurimudb-zero-config\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# or yarn add kurimudb-zero-config")]),t._v("\n")])])]),n("p",[t._v("包内提供了 "),n("code",[t._v("memory")]),t._v("，"),n("code",[t._v("local")]),t._v(" 和 "),n("code",[t._v("db")]),t._v(" 三个对象，下面是使用它们进行增删改查的例子，超简单：")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" memory"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" local"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" db "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"kurimudb-zero-config"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * Memory 对象\n * 它会把你的数据存储在 Memory 中，当页面刷新，数据就会被清空咯~\n */")]),t._v("\nmemory"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello world"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建或更新..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" memory"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 读取..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("delete")]),t._v(" memory"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 删除..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"say"')]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" memory"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 判断是否存在..")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * Local 对象\n * 它会把你的数据存储在 LocalStorage 中，即使页面刷新，数据还会在哒！\n * LocalStorage 一般可以存储约 5MB 左右的数据\n */")]),t._v("\nlocal"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello world"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建或更新..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" local"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 读取..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("delete")]),t._v(" local"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 删除..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"say"')]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" local"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 判断是否存在..")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * db 对象\n * 它会把你的数据存储在 IndexedDB 中，注意，IndexedDB 是异步的哦！\n * IndexedDB 可以保存诸如 File、Blob 等 JavaScript 对象\n * IndexedDB 数据量基于设备的可用硬盘大小\n */")]),t._v("\ndb"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello world"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建或更新..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" db"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 读取，记得加 await..")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("delete")]),t._v(" db"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 删除..")]),t._v("\ndb"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("has")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"say"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 判断是否存在..")]),t._v("\n")])])]),n("p",[t._v("如你所见，Kurimudb 就像操作一个普通 Javascript 对象一样简单。但是，在背后，你的数据已经被存储到各种地方啦。")]),t._v(" "),n("p",[n("code",[t._v("kurimudb-zero-config")]),t._v(" 默认使用了 "),n("RouterLink",{attrs:{to:"/cache/#rxjs"}},[t._v("RxJS")]),t._v(" 作为订阅更新的驱动，只要你在变量名后加上 "),n("code",[t._v("$")]),t._v("，你就可以获得一个此值的 "),n("a",{attrs:{href:"https://rxjs.dev/guide/subject#behaviorsubject",target:"_blank",rel:"noopener noreferrer"}},[t._v("BehaviorSubject 对象"),n("OutboundLink")],1),t._v("。我们可以通过这种方式来订阅此变量，在它被改变时做点什么：")],1),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" local "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"kurimudb"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 订阅这个变量..")]),t._v("\nlocal"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say$"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("subscribe")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("val")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"what you want to say: "')]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" val"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nlocal"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello world"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 也可以用 rxjs 强大的操作符..")]),t._v("\nlocal"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("say$"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("pipe")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("subscribe")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("val")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("h2",{attrs:{id:"准备好了吗"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#准备好了吗"}},[t._v("#")]),t._v(" 准备好了吗？")]),t._v(" "),n("p",[t._v("我们刚刚介绍了 Kurimudb 的核心用法——但这些对于大中型应用来说可能还不够，所以，请务必读完整个教程！")])])}),[],!1,null,null,null);a.default=e.exports}}]);