"use strict";(self.webpackChunkopen_education_builder=self.webpackChunkopen_education_builder||[]).push([[162],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=a.createContext({}),p=function(e){var t=a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(d.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,d=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=p(n),m=r,g=c["".concat(d,".").concat(m)]||c[m]||s[m]||i;return n?a.createElement(g,l(l({ref:t},u),{},{components:n})):a.createElement(g,l({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=c;var o={};for(var d in t)hasOwnProperty.call(t,d)&&(o[d]=t[d]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var p=2;p<i;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},9390:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>s,frontMatter:()=>i,metadata:()=>o,toc:()=>p});var a=n(7462),r=(n(7294),n(3905));const i={},l="Getting started",o={unversionedId:"getting-started",id:"getting-started",title:"Getting started",description:"Overview",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started",permalink:"/openedu_builder/getting-started",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"Introduction",permalink:"/openedu_builder/"},next:{title:"Plugins",permalink:"/openedu_builder/plugins/"}},d={},p=[{value:"Overview",id:"overview",level:2},{value:"Configuration",id:"configuration",level:2}],u={toc:p};function s(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"getting-started"},"Getting started"),(0,r.kt)("h2",{id:"overview"},"Overview"),(0,r.kt)("p",null,"The structure of the builder is very simple. The main thing a user needs to worry about is the configuration file. The configuration file is in the YAML format, should be placed at the root of your project, and should be named ",(0,r.kt)("inlineCode",{parentName:"p"},"config.yaml"),"."),(0,r.kt)("p",null,"Based on the steps defined in the configuration file, the builder will construct plugins and run them in the order specified. Each step has an associated input directory and output directory. By default, the input directory is the root of the project and the outout directory is a a directory with the same name under the ",(0,r.kt)("inlineCode",{parentName:"p"},"build")," directory."),(0,r.kt)("p",null,"For example, in the below configuration, the output directory for the ",(0,r.kt)("inlineCode",{parentName:"p"},"demo_stage")," step is ",(0,r.kt)("inlineCode",{parentName:"p"},"/build/demo_stage"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'stages:\n  - demo_stage\n\nbuild_dir: /build\n\ndemo_stage:\n  plugin: command\n  options:\n    command: echo\n    args:\n      - "Hello World"\n')),(0,r.kt)("p",null,"The builder is designed to be extensible. It comes with a few plugins, but the user can also create their own plugins. The plugins are defined in the ",(0,r.kt)("inlineCode",{parentName:"p"},"plugins")," directory. For further details check the ",(0,r.kt)("a",{parentName:"p",href:"/openedu_builder/plugins/"},"plugins")," section."),(0,r.kt)("p",null,"Most plugins will have a set of dependencies that need to be installed in order to run. The builder does not install these dependencies. The recommended way to install these dependencies is to create a Docker container that extends the builder container and installs the dependencies. The example below installs the dependencies needed to run the revealmd and docusaurus plugins."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-dockerfile"},'FROM ghcr.io/open-education-hub/openedu_builder:latest\n\n# Install curl\nRUN apt-get update && \\\n    apt-get install -y curl\n\n# Install node LTS (16)\nRUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \\\n    apt-get install -y nodejs\n\n# Install reveal md\nRUN npm install -g reveal-md\n\n# Install docusaurus\nRUN npm install create-docusaurus@2.1.0\n\nWORKDIR /content\n\nENTRYPOINT ["oe_builder"]\n')),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"ENTRYPOINT")," should always be ",(0,r.kt)("inlineCode",{parentName:"p"},"oe_builder"),". The ",(0,r.kt)("inlineCode",{parentName:"p"},"WORKDIR")," can be whatever you want as long as you ",(0,r.kt)("a",{parentName:"p",href:"https://docs.docker.com/storage/bind-mounts/"},"mount")," the root of your project (containing the ",(0,r.kt)("inlineCode",{parentName:"p"},"config.yaml")," file) to ",(0,r.kt)("inlineCode",{parentName:"p"},"WORKDIR")," in the container."),(0,r.kt)("h2",{id:"configuration"},"Configuration"),(0,r.kt)("p",null,"The main configuration options are as follows:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"option"),(0,r.kt)("th",{parentName:"tr",align:null},"type"),(0,r.kt)("th",{parentName:"tr",align:null},"required"),(0,r.kt)("th",{parentName:"tr",align:null},"default"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"stages")),(0,r.kt)("td",{parentName:"tr",align:null},"list","[str]"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"true")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"N\\A")),(0,r.kt)("td",{parentName:"tr",align:null},"The list of stages to run, in order.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"build_dir")),(0,r.kt)("td",{parentName:"tr",align:null},"str"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"false")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"/build")),(0,r.kt)("td",{parentName:"tr",align:null},"The directory to use for the build.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"output_dir")),(0,r.kt)("td",{parentName:"tr",align:null},"str"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"false")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"/output")),(0,r.kt)("td",{parentName:"tr",align:null},"The directory to use for the output.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"output_type")),(0,r.kt)("td",{parentName:"tr",align:null},"str"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"false")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"last")),(0,r.kt)("td",{parentName:"tr",align:null},"The type of output to use. Can be ",(0,r.kt)("inlineCode",{parentName:"td"},"last")," or ",(0,r.kt)("inlineCode",{parentName:"td"},"all"),". ",(0,r.kt)("inlineCode",{parentName:"td"},"last")," keeps only the output of the lat stage, while ",(0,r.kt)("inlineCode",{parentName:"td"},"all")," keeps the output of all stages (basically outputs the build directory).")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"<stage_name>")),(0,r.kt)("td",{parentName:"tr",align:null},"dict"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"false")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"N\\A")),(0,r.kt)("td",{parentName:"tr",align:null},"The configuration for a specific stage.")))),(0,r.kt)("p",null,"Each stage is required to have the ",(0,r.kt)("inlineCode",{parentName:"p"},"plugin")," option that specifies what plugin to run.\nAdditionally, the ",(0,r.kt)("inlineCode",{parentName:"p"},"input_dir")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"output_dir")," options can be specified to override the default input and output directories."))}s.isMDXComponent=!0}}]);