{"filter":false,"title":"index.jsx","tooltip":"/frontend/src/index.jsx","undoManager":{"mark":100,"position":100,"stack":[[{"start":{"row":24,"column":0},"end":{"row":26,"column":4},"action":"insert","lines":["const setAuthorizationLink = setContext((request, previousContext) => ({","  headers: {authorization: \"1234\"}","}));"],"id":75}],[{"start":{"row":24,"column":6},"end":{"row":24,"column":22},"action":"remove","lines":["setAuthorization"],"id":76},{"start":{"row":24,"column":6},"end":{"row":24,"column":7},"action":"insert","lines":["a"]},{"start":{"row":24,"column":7},"end":{"row":24,"column":8},"action":"insert","lines":["u"]},{"start":{"row":24,"column":8},"end":{"row":24,"column":9},"action":"insert","lines":["t"]},{"start":{"row":24,"column":9},"end":{"row":24,"column":10},"action":"insert","lines":["h"]}],[{"start":{"row":24,"column":58},"end":{"row":24,"column":59},"action":"remove","lines":["("],"id":77}],[{"start":{"row":24,"column":58},"end":{"row":24,"column":59},"action":"insert","lines":["{"],"id":78}],[{"start":{"row":24,"column":59},"end":{"row":25,"column":0},"action":"insert","lines":["",""],"id":79},{"start":{"row":25,"column":0},"end":{"row":25,"column":1},"action":"insert","lines":["\t"]}],[{"start":{"row":26,"column":34},"end":{"row":27,"column":0},"action":"insert","lines":["",""],"id":80},{"start":{"row":27,"column":0},"end":{"row":27,"column":2},"action":"insert","lines":["  "]}],[{"start":{"row":25,"column":0},"end":{"row":25,"column":1},"action":"insert","lines":["\t"],"id":81}],[{"start":{"row":25,"column":0},"end":{"row":25,"column":1},"action":"remove","lines":["\t"],"id":82}],[{"start":{"row":25,"column":0},"end":{"row":25,"column":1},"action":"insert","lines":["r"],"id":83},{"start":{"row":25,"column":1},"end":{"row":25,"column":2},"action":"insert","lines":["e"]},{"start":{"row":25,"column":2},"end":{"row":25,"column":3},"action":"insert","lines":["t"]},{"start":{"row":25,"column":3},"end":{"row":25,"column":4},"action":"insert","lines":["u"]},{"start":{"row":25,"column":4},"end":{"row":25,"column":5},"action":"insert","lines":["r"]},{"start":{"row":25,"column":5},"end":{"row":25,"column":6},"action":"insert","lines":["n"]}],[{"start":{"row":28,"column":1},"end":{"row":28,"column":2},"action":"insert","lines":["}"],"id":84}],[{"start":{"row":28,"column":2},"end":{"row":28,"column":3},"action":"remove","lines":[")"],"id":85}],[{"start":{"row":25,"column":0},"end":{"row":25,"column":1},"action":"insert","lines":["\t"],"id":86},{"start":{"row":25,"column":7},"end":{"row":25,"column":8},"action":"remove","lines":["\t"]},{"start":{"row":25,"column":7},"end":{"row":25,"column":8},"action":"insert","lines":[" "]},{"start":{"row":26,"column":0},"end":{"row":26,"column":2},"action":"remove","lines":["  "]},{"start":{"row":26,"column":0},"end":{"row":26,"column":2},"action":"insert","lines":["\t\t"]},{"start":{"row":26,"column":12},"end":{"row":26,"column":13},"action":"insert","lines":[" "]},{"start":{"row":26,"column":34},"end":{"row":26,"column":35},"action":"insert","lines":[" "]},{"start":{"row":27,"column":0},"end":{"row":27,"column":2},"action":"remove","lines":["  "]},{"start":{"row":28,"column":0},"end":{"row":28,"column":1},"action":"insert","lines":["\t"]},{"start":{"row":28,"column":2},"end":{"row":29,"column":0},"action":"insert","lines":["",""]}],[{"start":{"row":26,"column":36},"end":{"row":27,"column":0},"action":"remove","lines":["",""],"id":87}],[{"start":{"row":26,"column":11},"end":{"row":26,"column":36},"action":"remove","lines":["{ authorization: \"1234\" }"],"id":88},{"start":{"row":26,"column":11},"end":{"row":28,"column":3},"action":"insert","lines":["{","\t\t\t'Authorization': \"Bearer \" + tokens.accessToken","\t\t}"]}],[{"start":{"row":33,"column":0},"end":{"row":34,"column":0},"action":"remove","lines":["\tconst tokens = JSON.parse(localStorage.getItem(\"tokens\"));",""],"id":89}],[{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"insert","lines":["\tconst tokens = JSON.parse(localStorage.getItem(\"tokens\"));",""],"id":90}],[{"start":{"row":33,"column":0},"end":{"row":41,"column":0},"action":"remove","lines":["const authLink = new ApolloLink((operation, forward) => {","\toperation.setContext({","\t\theaders: {","\t\t\t'Authorization': \"Bearer \" + tokens.accessToken","\t\t}","\t})","\treturn forward(operation)","})",""],"id":91},{"start":{"row":33,"column":0},"end":{"row":34,"column":0},"action":"remove","lines":["",""]}],[{"start":{"row":18,"column":0},"end":{"row":19,"column":0},"action":"insert","lines":["import { setContext } from \"apollo-link-context\";",""],"id":92}],[{"start":{"row":25,"column":59},"end":{"row":26,"column":0},"action":"insert","lines":["",""],"id":93},{"start":{"row":26,"column":0},"end":{"row":26,"column":1},"action":"insert","lines":["\t"]}],[{"start":{"row":26,"column":1},"end":{"row":26,"column":2},"action":"insert","lines":["l"],"id":94},{"start":{"row":26,"column":2},"end":{"row":26,"column":3},"action":"insert","lines":["e"]},{"start":{"row":26,"column":3},"end":{"row":26,"column":4},"action":"insert","lines":["t"]}],[{"start":{"row":26,"column":4},"end":{"row":26,"column":5},"action":"insert","lines":[" "],"id":95},{"start":{"row":26,"column":5},"end":{"row":26,"column":6},"action":"insert","lines":["t"]},{"start":{"row":26,"column":6},"end":{"row":26,"column":7},"action":"insert","lines":["o"]},{"start":{"row":26,"column":7},"end":{"row":26,"column":8},"action":"insert","lines":["k"]},{"start":{"row":26,"column":8},"end":{"row":26,"column":9},"action":"insert","lines":["e"]},{"start":{"row":26,"column":9},"end":{"row":26,"column":10},"action":"insert","lines":["n"]},{"start":{"row":26,"column":10},"end":{"row":26,"column":11},"action":"insert","lines":["s"]}],[{"start":{"row":26,"column":11},"end":{"row":26,"column":12},"action":"insert","lines":[" "],"id":96},{"start":{"row":26,"column":12},"end":{"row":26,"column":13},"action":"insert","lines":["="]}],[{"start":{"row":26,"column":13},"end":{"row":26,"column":14},"action":"insert","lines":[" "],"id":97}],[{"start":{"row":26,"column":14},"end":{"row":26,"column":44},"action":"insert","lines":["localStorage.getItem(\"tokens\")"],"id":98}],[{"start":{"row":26,"column":44},"end":{"row":26,"column":45},"action":"insert","lines":[";"],"id":99}],[{"start":{"row":26,"column":45},"end":{"row":27,"column":0},"action":"insert","lines":["",""],"id":100},{"start":{"row":27,"column":0},"end":{"row":27,"column":1},"action":"insert","lines":["\t"]},{"start":{"row":27,"column":1},"end":{"row":27,"column":2},"action":"insert","lines":["i"]},{"start":{"row":27,"column":2},"end":{"row":27,"column":3},"action":"insert","lines":["f"]}],[{"start":{"row":27,"column":3},"end":{"row":27,"column":4},"action":"insert","lines":[" "],"id":101}],[{"start":{"row":27,"column":3},"end":{"row":27,"column":4},"action":"remove","lines":[" "],"id":102}],[{"start":{"row":27,"column":3},"end":{"row":27,"column":4},"action":"insert","lines":["("],"id":103},{"start":{"row":27,"column":4},"end":{"row":27,"column":5},"action":"insert","lines":["t"]},{"start":{"row":27,"column":5},"end":{"row":27,"column":6},"action":"insert","lines":["o"]},{"start":{"row":27,"column":6},"end":{"row":27,"column":7},"action":"insert","lines":["k"]},{"start":{"row":27,"column":7},"end":{"row":27,"column":8},"action":"insert","lines":["e"]},{"start":{"row":27,"column":8},"end":{"row":27,"column":9},"action":"insert","lines":["n"]},{"start":{"row":27,"column":9},"end":{"row":27,"column":10},"action":"insert","lines":["s"]}],[{"start":{"row":27,"column":10},"end":{"row":27,"column":11},"action":"insert","lines":[")"],"id":104}],[{"start":{"row":27,"column":11},"end":{"row":27,"column":12},"action":"insert","lines":[" "],"id":105},{"start":{"row":27,"column":12},"end":{"row":27,"column":13},"action":"insert","lines":["{"]},{"start":{"row":27,"column":13},"end":{"row":27,"column":14},"action":"insert","lines":["}"]}],[{"start":{"row":27,"column":13},"end":{"row":28,"column":0},"action":"insert","lines":["",""],"id":106},{"start":{"row":28,"column":0},"end":{"row":28,"column":2},"action":"insert","lines":["\t\t"]}],[{"start":{"row":28,"column":1},"end":{"row":28,"column":2},"action":"remove","lines":["\t"],"id":107}],[{"start":{"row":28,"column":2},"end":{"row":28,"column":3},"action":"insert","lines":[" "],"id":108},{"start":{"row":28,"column":3},"end":{"row":28,"column":4},"action":"insert","lines":["e"]},{"start":{"row":28,"column":4},"end":{"row":28,"column":5},"action":"insert","lines":["l"]},{"start":{"row":28,"column":5},"end":{"row":28,"column":6},"action":"insert","lines":["s"]},{"start":{"row":28,"column":6},"end":{"row":28,"column":7},"action":"insert","lines":["e"]}],[{"start":{"row":28,"column":7},"end":{"row":28,"column":8},"action":"insert","lines":[" "],"id":109},{"start":{"row":28,"column":8},"end":{"row":28,"column":9},"action":"insert","lines":["{"]},{"start":{"row":28,"column":9},"end":{"row":28,"column":10},"action":"insert","lines":["}"]}],[{"start":{"row":28,"column":9},"end":{"row":29,"column":0},"action":"insert","lines":["",""],"id":110},{"start":{"row":29,"column":0},"end":{"row":29,"column":2},"action":"insert","lines":["\t\t"]}],[{"start":{"row":30,"column":0},"end":{"row":31,"column":0},"action":"remove","lines":["\tconst tokens = JSON.parse(localStorage.getItem(\"tokens\"));",""],"id":111}],[{"start":{"row":28,"column":0},"end":{"row":29,"column":0},"action":"insert","lines":["\tconst tokens = JSON.parse(localStorage.getItem(\"tokens\"));",""],"id":112}],[{"start":{"row":31,"column":0},"end":{"row":35,"column":0},"action":"remove","lines":["\treturn {","\t\theaders: {","\t\t\t'Authorization': \"Bearer \" + tokens.accessToken","\t\t}",""],"id":113}],[{"start":{"row":29,"column":0},"end":{"row":33,"column":0},"action":"insert","lines":["\treturn {","\t\theaders: {","\t\t\t'Authorization': \"Bearer \" + tokens.accessToken","\t\t}",""],"id":114}],[{"start":{"row":33,"column":9},"end":{"row":34,"column":0},"action":"insert","lines":["",""],"id":115},{"start":{"row":34,"column":0},"end":{"row":34,"column":2},"action":"insert","lines":["\t\t"]},{"start":{"row":34,"column":2},"end":{"row":34,"column":3},"action":"insert","lines":["r"]},{"start":{"row":34,"column":3},"end":{"row":34,"column":4},"action":"insert","lines":["e"]},{"start":{"row":34,"column":4},"end":{"row":34,"column":5},"action":"insert","lines":["t"]},{"start":{"row":34,"column":5},"end":{"row":34,"column":6},"action":"insert","lines":["u"]},{"start":{"row":34,"column":6},"end":{"row":34,"column":7},"action":"insert","lines":["r"]},{"start":{"row":34,"column":7},"end":{"row":34,"column":8},"action":"insert","lines":["n"]}],[{"start":{"row":34,"column":8},"end":{"row":34,"column":9},"action":"insert","lines":[" "],"id":116},{"start":{"row":34,"column":9},"end":{"row":34,"column":10},"action":"insert","lines":["p"]},{"start":{"row":34,"column":10},"end":{"row":34,"column":11},"action":"insert","lines":["r"]},{"start":{"row":34,"column":11},"end":{"row":34,"column":12},"action":"insert","lines":["e"]}],[{"start":{"row":34,"column":9},"end":{"row":34,"column":12},"action":"remove","lines":["pre"],"id":117},{"start":{"row":34,"column":9},"end":{"row":34,"column":24},"action":"insert","lines":["previousContext"]}],[{"start":{"row":34,"column":24},"end":{"row":34,"column":25},"action":"insert","lines":[";"],"id":118}],[{"start":{"row":33,"column":2},"end":{"row":33,"column":3},"action":"remove","lines":[" "],"id":119},{"start":{"row":33,"column":2},"end":{"row":34,"column":0},"action":"insert","lines":["",""]},{"start":{"row":34,"column":0},"end":{"row":34,"column":1},"action":"insert","lines":["\t"]},{"start":{"row":34,"column":1},"end":{"row":34,"column":2},"action":"insert","lines":["}"]}],[{"start":{"row":36,"column":2},"end":{"row":36,"column":3},"action":"remove","lines":["}"],"id":120}],[{"start":{"row":27,"column":3},"end":{"row":27,"column":4},"action":"insert","lines":[" "],"id":121},{"start":{"row":28,"column":0},"end":{"row":28,"column":1},"action":"insert","lines":["\t"]},{"start":{"row":29,"column":1},"end":{"row":29,"column":2},"action":"insert","lines":["\t"]},{"start":{"row":30,"column":0},"end":{"row":30,"column":1},"action":"insert","lines":["\t"]},{"start":{"row":31,"column":0},"end":{"row":31,"column":1},"action":"insert","lines":["\t"]},{"start":{"row":32,"column":2},"end":{"row":33,"column":2},"action":"insert","lines":["\t}","\t\t"]},{"start":{"row":35,"column":1},"end":{"row":35,"column":2},"action":"remove","lines":["}"]},{"start":{"row":37,"column":0},"end":{"row":37,"column":2},"action":"remove","lines":["\t\t"]}],[{"start":{"row":36,"column":25},"end":{"row":37,"column":0},"action":"remove","lines":["",""],"id":122}],[{"start":{"row":27,"column":11},"end":{"row":27,"column":12},"action":"insert","lines":[" "],"id":123},{"start":{"row":27,"column":12},"end":{"row":27,"column":13},"action":"insert","lines":["!"]},{"start":{"row":27,"column":13},"end":{"row":27,"column":14},"action":"insert","lines":["="]},{"start":{"row":27,"column":14},"end":{"row":27,"column":15},"action":"insert","lines":["="]}],[{"start":{"row":27,"column":15},"end":{"row":27,"column":16},"action":"insert","lines":[" "],"id":124},{"start":{"row":27,"column":16},"end":{"row":27,"column":17},"action":"insert","lines":["n"]},{"start":{"row":27,"column":17},"end":{"row":27,"column":18},"action":"insert","lines":["u"]},{"start":{"row":27,"column":18},"end":{"row":27,"column":19},"action":"insert","lines":["l"]},{"start":{"row":27,"column":19},"end":{"row":27,"column":20},"action":"insert","lines":["l"]}],[{"start":{"row":61,"column":1},"end":{"row":61,"column":2},"action":"insert","lines":["/"],"id":125},{"start":{"row":61,"column":2},"end":{"row":61,"column":3},"action":"insert","lines":["/"]}],[{"start":{"row":60,"column":10},"end":{"row":60,"column":11},"action":"remove","lines":[","],"id":126}],[{"start":{"row":64,"column":36},"end":{"row":64,"column":38},"action":"remove","lines":["{}"],"id":127},{"start":{"row":64,"column":36},"end":{"row":70,"column":1},"action":"insert","lines":["{","\turl: process.env.NODE_ENV === \"development\" ?","\t\tprocess.env.REACT_APP_LOCAL_APPSYNC_URL : \"https://vipqqwuxvfdn7gaos7u4aav3su.appsync-api.eu-west-1.amazonaws.com/graphql\",","\tregion: \"eu-west-1\",","\tauth: { type: AUTH_TYPE.NONE },","\tdisableOffline: true","}"]}],[{"start":{"row":61,"column":2},"end":{"row":61,"column":3},"action":"remove","lines":["/"],"id":128},{"start":{"row":61,"column":1},"end":{"row":61,"column":2},"action":"remove","lines":["/"]}],[{"start":{"row":60,"column":10},"end":{"row":60,"column":11},"action":"insert","lines":[","],"id":129}],[{"start":{"row":55,"column":0},"end":{"row":56,"column":0},"action":"remove","lines":["\tdisableOffline: true",""],"id":130}],[{"start":{"row":54,"column":31},"end":{"row":54,"column":32},"action":"remove","lines":[","],"id":131}],[{"start":{"row":64,"column":0},"end":{"row":67,"column":32},"action":"remove","lines":["\turl: process.env.NODE_ENV === \"development\" ?","\t\tprocess.env.REACT_APP_LOCAL_APPSYNC_URL : \"https://vipqqwuxvfdn7gaos7u4aav3su.appsync-api.eu-west-1.amazonaws.com/graphql\",","\tregion: \"eu-west-1\",","\tauth: { type: AUTH_TYPE.NONE },"],"id":132},{"start":{"row":64,"column":0},"end":{"row":65,"column":0},"action":"remove","lines":["",""]}],[{"start":{"row":54,"column":25},"end":{"row":54,"column":29},"action":"remove","lines":["NONE"],"id":134},{"start":{"row":54,"column":25},"end":{"row":54,"column":32},"action":"insert","lines":["AWS_IAM"]}],[{"start":{"row":54,"column":32},"end":{"row":54,"column":33},"action":"insert","lines":[","],"id":135}],[{"start":{"row":54,"column":33},"end":{"row":54,"column":34},"action":"insert","lines":[" "],"id":136}],[{"start":{"row":54,"column":34},"end":{"row":54,"column":45},"action":"insert","lines":["credentials"],"id":137}],[{"start":{"row":54,"column":45},"end":{"row":54,"column":46},"action":"insert","lines":[":"],"id":138}],[{"start":{"row":54,"column":46},"end":{"row":54,"column":47},"action":"insert","lines":[" "],"id":139}],[{"start":{"row":54,"column":47},"end":{"row":54,"column":48},"action":"insert","lines":["{"],"id":140},{"start":{"row":54,"column":48},"end":{"row":54,"column":49},"action":"insert","lines":["}"]}],[{"start":{"row":54,"column":47},"end":{"row":54,"column":49},"action":"remove","lines":["{}"],"id":141}],[{"start":{"row":54,"column":47},"end":{"row":55,"column":16},"action":"insert","lines":["new AWS.CognitoIdentityCredentials({","  IdentityPoolId"],"id":142}],[{"start":{"row":55,"column":16},"end":{"row":55,"column":17},"action":"insert","lines":[":"],"id":143}],[{"start":{"row":55,"column":17},"end":{"row":55,"column":18},"action":"insert","lines":[" "],"id":144},{"start":{"row":55,"column":18},"end":{"row":55,"column":19},"action":"insert","lines":["\""]},{"start":{"row":55,"column":19},"end":{"row":55,"column":20},"action":"insert","lines":["\""]}],[{"start":{"row":55,"column":22},"end":{"row":55,"column":23},"action":"insert","lines":["}"],"id":145}],[{"start":{"row":55,"column":22},"end":{"row":55,"column":23},"action":"remove","lines":["}"],"id":146}],[{"start":{"row":55,"column":22},"end":{"row":55,"column":23},"action":"insert","lines":[")"],"id":147}],[{"start":{"row":55,"column":23},"end":{"row":55,"column":24},"action":"insert","lines":["}"],"id":148}],[{"start":{"row":54,"column":8},"end":{"row":54,"column":9},"action":"remove","lines":[" "],"id":149},{"start":{"row":54,"column":8},"end":{"row":55,"column":2},"action":"insert","lines":["","\t\t"]},{"start":{"row":55,"column":26},"end":{"row":55,"column":27},"action":"remove","lines":[" "]},{"start":{"row":55,"column":26},"end":{"row":56,"column":2},"action":"insert","lines":["","\t\t"]},{"start":{"row":57,"column":0},"end":{"row":57,"column":2},"action":"remove","lines":["  "]},{"start":{"row":57,"column":0},"end":{"row":57,"column":3},"action":"insert","lines":["\t\t\t"]},{"start":{"row":57,"column":21},"end":{"row":57,"column":22},"action":"remove","lines":[" "]},{"start":{"row":57,"column":21},"end":{"row":58,"column":2},"action":"insert","lines":["","\t\t"]},{"start":{"row":58,"column":4},"end":{"row":59,"column":1},"action":"insert","lines":["","\t"]}],[{"start":{"row":15,"column":0},"end":{"row":16,"column":0},"action":"insert","lines":["",""],"id":150}],[{"start":{"row":16,"column":0},"end":{"row":17,"column":0},"action":"insert","lines":["var AWS = require('aws-sdk');",""],"id":151}],[{"start":{"row":16,"column":0},"end":{"row":16,"column":3},"action":"remove","lines":["var"],"id":152},{"start":{"row":16,"column":0},"end":{"row":16,"column":1},"action":"insert","lines":["i"]},{"start":{"row":16,"column":1},"end":{"row":16,"column":2},"action":"insert","lines":["m"]},{"start":{"row":16,"column":2},"end":{"row":16,"column":3},"action":"insert","lines":["p"]},{"start":{"row":16,"column":3},"end":{"row":16,"column":4},"action":"insert","lines":["o"]},{"start":{"row":16,"column":4},"end":{"row":16,"column":5},"action":"insert","lines":["r"]},{"start":{"row":16,"column":5},"end":{"row":16,"column":6},"action":"insert","lines":["t"]}],[{"start":{"row":16,"column":11},"end":{"row":16,"column":21},"action":"remove","lines":["= require("],"id":153},{"start":{"row":16,"column":11},"end":{"row":16,"column":12},"action":"insert","lines":["f"]},{"start":{"row":16,"column":12},"end":{"row":16,"column":13},"action":"insert","lines":["r"]},{"start":{"row":16,"column":13},"end":{"row":16,"column":14},"action":"insert","lines":["o"]},{"start":{"row":16,"column":14},"end":{"row":16,"column":15},"action":"insert","lines":["m"]}],[{"start":{"row":16,"column":15},"end":{"row":16,"column":16},"action":"insert","lines":[" "],"id":154},{"start":{"row":16,"column":16},"end":{"row":16,"column":17},"action":"insert","lines":["\""]}],[{"start":{"row":16,"column":17},"end":{"row":16,"column":18},"action":"remove","lines":["'"],"id":155}],[{"start":{"row":16,"column":24},"end":{"row":16,"column":26},"action":"remove","lines":["')"],"id":156},{"start":{"row":16,"column":24},"end":{"row":16,"column":25},"action":"insert","lines":["\""]}],[{"start":{"row":59,"column":20},"end":{"row":59,"column":21},"action":"insert","lines":["x"],"id":157},{"start":{"row":59,"column":21},"end":{"row":59,"column":22},"action":"insert","lines":["x"]},{"start":{"row":59,"column":22},"end":{"row":59,"column":23},"action":"insert","lines":["x"]}],[{"start":{"row":70,"column":37},"end":{"row":71,"column":1},"action":"remove","lines":["","\t"],"id":158}],[{"start":{"row":70,"column":37},"end":{"row":70,"column":38},"action":"insert","lines":[" "],"id":159}],[{"start":{"row":70,"column":58},"end":{"row":71,"column":0},"action":"remove","lines":["",""],"id":160},{"start":{"row":70,"column":58},"end":{"row":70,"column":59},"action":"insert","lines":[" "]}],[{"start":{"row":59,"column":20},"end":{"row":59,"column":23},"action":"remove","lines":["xxx"],"id":161},{"start":{"row":59,"column":20},"end":{"row":59,"column":66},"action":"insert","lines":["eu-west-1:dffe4e03-9e89-4118-911f-ee327e257d9f"]}],[{"start":{"row":51,"column":0},"end":{"row":52,"column":0},"action":"insert","lines":["",""],"id":165}],[{"start":{"row":52,"column":0},"end":{"row":52,"column":41},"action":"insert","lines":["AWS.config.update({region: 'us-east-1'});"],"id":166}],[{"start":{"row":52,"column":28},"end":{"row":52,"column":37},"action":"remove","lines":["us-east-1"],"id":167},{"start":{"row":52,"column":28},"end":{"row":52,"column":37},"action":"insert","lines":["eu-west-1"]}],[{"start":{"row":33,"column":5},"end":{"row":33,"column":18},"action":"remove","lines":["Authorization"],"id":168},{"start":{"row":33,"column":5},"end":{"row":33,"column":6},"action":"insert","lines":["X"]},{"start":{"row":33,"column":6},"end":{"row":33,"column":7},"action":"insert","lines":["0"]}],[{"start":{"row":33,"column":6},"end":{"row":33,"column":7},"action":"remove","lines":["0"],"id":169}],[{"start":{"row":33,"column":6},"end":{"row":33,"column":7},"action":"insert","lines":["-"],"id":170},{"start":{"row":33,"column":7},"end":{"row":33,"column":8},"action":"insert","lines":["A"]},{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"insert","lines":["p"]},{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"insert","lines":["p"]},{"start":{"row":33,"column":10},"end":{"row":33,"column":11},"action":"insert","lines":["-"]}],[{"start":{"row":33,"column":11},"end":{"row":33,"column":12},"action":"insert","lines":["T"],"id":171},{"start":{"row":33,"column":12},"end":{"row":33,"column":13},"action":"insert","lines":["o"]},{"start":{"row":33,"column":13},"end":{"row":33,"column":14},"action":"insert","lines":["k"]},{"start":{"row":33,"column":14},"end":{"row":33,"column":15},"action":"insert","lines":["e"]},{"start":{"row":33,"column":15},"end":{"row":33,"column":16},"action":"insert","lines":["n"]}],[{"start":{"row":33,"column":5},"end":{"row":33,"column":6},"action":"remove","lines":["X"],"id":172},{"start":{"row":33,"column":5},"end":{"row":33,"column":6},"action":"insert","lines":["ч"]}],[{"start":{"row":33,"column":5},"end":{"row":33,"column":6},"action":"remove","lines":["ч"],"id":173}],[{"start":{"row":33,"column":5},"end":{"row":33,"column":6},"action":"insert","lines":["x"],"id":174}],[{"start":{"row":33,"column":7},"end":{"row":33,"column":8},"action":"insert","lines":["a"],"id":175},{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"insert","lines":["a"]}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"remove","lines":["A"],"id":176}],[{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"remove","lines":["a"],"id":177}],[{"start":{"row":33,"column":11},"end":{"row":33,"column":12},"action":"remove","lines":["T"],"id":178}],[{"start":{"row":33,"column":11},"end":{"row":33,"column":12},"action":"insert","lines":["t"],"id":179}]]},"ace":{"folds":[],"scrolltop":375,"scrollleft":0,"selection":{"start":{"row":33,"column":11},"end":{"row":33,"column":12},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":true,"wrapToView":true},"firstLineState":{"row":100,"state":["jsx",2],"mode":"ace/mode/javascript"}},"timestamp":1539101145002,"hash":"060be4fe84120e2a7466cdff50a53bfdf88f7f24"}