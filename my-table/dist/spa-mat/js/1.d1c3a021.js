(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{"5KbQ":function(e,t,r){"use strict";var i=r("e6BW"),s=r.n(i);s.a},e6BW:function(e,t,r){},"kmF/":function(e,t,r){"use strict";r.r(t);var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("q-page",{staticClass:"flex flex-center"},[r("myTable")],1)},s=[];i._withStripped=!0;var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticStyle:{width:"100%"}},[r("q-table",{ref:"table",attrs:{data:e.serverData,columns:e.columns,"row-key":"id",pagination:e.serverPagination,loading:e.loading},on:{"update:pagination":function(t){e.serverPagination=t}}}),r("q-scroll-area",{ref:"scrollArea",style:"width: 100%; height: "+e.rowHeight*e.serverPagination.rowsPerPage+"px;"},[e._l(e.freezeRows,function(t,i){return r("div",{key:i+"-freezeCell",staticClass:"q-row",style:"height:"+e.rowHeight+"px; display: flex; position: fixed; width: 100%; margin-top: "+i*e.rowHeight+"px; background-color: #e6e6e6;"},e._l(e.columns,function(t){return r("div",{key:t.name+i,staticClass:"q-cell",style:"width:"+t.width+"; background-color: #e6e6e6;"},[e._v("\n        "+e._s(e.collectedData[i][t.name])+"\n      ")])}))}),r("div",{ref:"virtualTop",style:"height:"+e.getSpaceTop()+"px;"}),e._l(e.serverData,function(t,i){return r("div",{key:i,staticClass:"q-row",style:"height:"+e.rowHeight+"px; display: flex;"},e._l(e.columns,function(s){return r("div",{key:s.name+i,staticClass:"q-cell",style:"width:"+s.width+"; background-color: #ffffff;"},[e._v("\n        "+e._s(t[s.name])+"\n      ")])}))}),r("div",{ref:"virtualBottom",style:"height:"+e.getSpaceBottom()+"px;"}),r("q-scroll-observable",{on:{scroll:e.scrolling}})],2)],1)},o=[];a._withStripped=!0;var n=r("vDqi"),l=r.n(n),c={data:function(){return{loading:!1,requestSource:null,serverPagination:{page:1,rowsPerPage:10,rowsNumber:1e3,rows:20},rowHeight:40,serverData:[],collectedData:[],currentPage:0,scrollOffset:0,scrollUnit:1,scrollUnitOffset:0,freezeRows:2,requestAPI:null,columns:[{name:"no",label:"No",field:"no",sortable:!1,width:"5%",align:"left"},{name:"id",required:!0,label:"Id",align:"left",field:"email",sortable:!1,width:"15%"},{name:"email",label:"E-Mail",field:"email",sortable:!1,width:"30%",align:"left"},{name:"name",label:"Name",field:"name",sortable:!1,align:"left",width:"25%"},{name:"phone",label:"Phone",field:"phone",sortable:!1,align:"left",width:"25%"}]}},methods:{request:function(e){var t=this,r=e.pagination;this.loading=!0;var i=l.a.CancelToken,s=i.source();console.log("request");var a=l.a.get("/api/?row_per_page=".concat(r.rowsPerPage,"&page=").concat(r.page,"&rows=").concat(r.rows),{cancelToken:s.token}).then(function(e){for(var i=e.data,s=0;s<i.length;s++){var a=r.rowsPerPage*(r.page-1)+s;t.collectedData[a]["id"]||(t.collectedData[a]=i[s])}t.renderData(),t.loading=!1}).catch(function(e){console.log("error",e),t.loading=!1,t.renderData()});return{promise:a,source:s}},getSpaceTop:function(){return this.currentPage*this.rowHeight*this.serverPagination.rowsPerPage},getSpaceBottom:function(){return(this.serverPagination.rowsNumber-2*this.serverPagination.rowsPerPage)*this.rowHeight-this.currentPage*this.rowHeight*this.serverPagination.rowsPerPage},renderData:function(){for(var e=this.currentPage*this.serverPagination.rowsPerPage,t=0;t<2*this.serverPagination.rowsPerPage;t++)this.serverData.length<2*this.serverPagination.rowsPerPage?this.serverData.push(JSON.parse(JSON.stringify(this.collectedData[e+t]))):this.serverData[t]=JSON.parse(JSON.stringify(this.collectedData[e+t]));for(var r=this.$refs.table.$el.querySelectorAll("th"),i=0;i<this.columns.length;i++)r[i].style.width=this.columns[i].width},scrolling:function(e){var t=this.rowHeight*this.serverPagination.rowsNumber;if(e.position&&!(e.position>=t)){this.scrollUnit=1*t/this.serverPagination.rowsNumber,this.scrollUnitOffset=1e3*e.position%(1e3*this.scrollUnit)/1e3;var r=e.position%(this.scrollUnit*this.serverPagination.rowsPerPage),i=parseInt(e.position/t*(1*this.serverPagination.rowsNumber/this.serverPagination.rowsPerPage));this.scrollOffset==r&&i-this.currentPage==1?(this.currentPage=i-1,this.$refs.scrollArea.setScrollPosition(r+this.currentPage*this.scrollUnit*this.serverPagination.rowsPerPage)):this.currentPage=i,this.scrollOffset=r,console.log(" curront page ",this.currentPage),this.isEnableScroll=!1;var s=this.currentPage*this.serverPagination.rowsPerPage,a=!1;s<this.serverPagination.rowsNumber&&!this.collectedData[s]["id"]&&(a=!0,this.requestSource&&this.requestSource.cancel(),this.requestAPI=this.request({pagination:{page:this.currentPage+1,rowsPerPage:this.serverPagination.rowsPerPage,rowsNumber:this.serverPagination.rowsNumber,rows:2*this.serverPagination.rowsPerPage}}),this.requestSource=this.requestAPI.source),!a&&s+this.serverPagination.rowsPerPage<this.serverPagination.rowsNumber&&!this.collectedData[s+this.serverPagination.rowsPerPage]["id"]&&(console.log(s+this.serverPagination.rowsPerPage,"------"),a=!0,this.requestSource&&this.requestSource.cancel(),this.requestAPI=this.request({pagination:{page:this.currentPage+2,rowsPerPage:this.serverPagination.rowsPerPage,rowsNumber:this.serverPagination.rowsNumber,rows:2*this.serverPagination.rowsPerPage}}),this.requestSource=this.requestAPI.source),a||this.renderData()}}},beforeMount:function(){this.collectedData=[];for(var e=0;e<this.serverPagination.rowsNumber+2*this.serverPagination.rowsPerPage;e++)this.collectedData.push({num:e+1,id:null,email:"",name:"",phone:""})},mounted:function(){var e=this.request({pagination:this.serverPagination});this.requestSource=e.source}},h=c,g=(r("roHL"),r("KHd+")),u=Object(g["a"])(h,a,o,!1,null,null,null),P=u.exports,w={name:"PageIndex",components:{myTable:P}},d=w,f=(r("5KbQ"),Object(g["a"])(d,i,s,!1,null,null,null));t["default"]=f.exports},rSw5:function(e,t,r){},roHL:function(e,t,r){"use strict";var i=r("rSw5"),s=r.n(i);s.a}}]);