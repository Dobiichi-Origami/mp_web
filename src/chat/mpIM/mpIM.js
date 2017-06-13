// import vm from 'src/main.js'
import chat from '../index.js'

function MpIMClient() {
        //SeqId说明 用于识别请求，每次发送请求加一，服务端会返回相应Reply请求的SeqId跟客户端一致
    this.seq = 1;
    //初始化
    this.init = function(DeviceInfo) {
            this.DeviceInfo = DeviceInfo;
            this.ws = new WebSocket('ws://101.37.28.77:8090/sub');
            console.log('正在连接')
            var me = this;
            this.ws.onopen = function() {
                if (this.readyState == 1) {
                    console.log('链接成功');
                    console.log(DeviceInfo)
                    me.login(DeviceInfo)
                } else {
                    console.log('链接失败，重新连接中')
                    this.init(DeviceInfo);
                }
            }

        }
        //每隔4.8分钟一次心跳，BODY不用传
    this.heart = function() {
            var me = this;
            setInterval(function() {
                me.ws.send(JSON.stringify({ 'ver': 1, 'op': 2, 'seq': this.seq++ }))
            }, 288000)
        }
        //登陆
    this.login = function(DeviceInfo) {
            var data = {
                'ver': 1,
                'op': 13,
                'seq': this.seq++,
                'body': DeviceInfo
            }
            data = JSON.stringify(data);
            this.ws.send(data)
            var me = this;
            this.ws.onmessage = function(evt) {
                    me.receive(evt.data)
                }
                //重新连接
            this.ws.onclose = function() {
                console.log('已断开连接，正在重新连接')
                me.init(me.DeviceInfo);
            }
        }
        //接收消息
        //消息体：
        //////******************属性为零的属性会被省略******************//////
        /*string target_id = 2;

    int64 target_no = 3;
    string sender_id = 4;
    int64 sender_no = 5;
    string sender_name = 6;
    string sender_head_img = 7;
    TargetType target_type:{
        PRIVATE = 0;
        GROUP = 1;
        CHATROOM = 2;
    }
    MsgType msg_type:
    {
        CHAT = 0;
        CMD = 1;
        SYSTEM = 2;
    }
    int64 msg_time:new Date().getTime();
    int32 msg_content_type：
    {
        SCMessageContentTypeText,0
        SCMessageContentTypeImage,1
        魔法表情
        SCMessageContentTypeAnimation,2
        红包
        SCMessageContentTypeEnvelope,3
        SCMessageContentTypeGif,4
    }
    bytes msg_content：
    {
        "speakType"         :SCMessageSpeakType,
        "content"           :String 原rongmsgcontent的exta中的content字段 可能是json字符串,
        "atList"            :Array, 
        "defaultContent"    :String(新的消息类型，解析不了的时候，默认是SCMessageContentTypeText类型，这个类型默认从这个字段读取content)原rongmsgcontent的content字段，用作兼容,
        "temp"              :Int
    }*/
    this.receive = function(data) {
            //接收消息处理
            console.log(data)
            data = JSON.parse(data)[0];
            console.log(data)
            var msg;
            if (data.op == 14) {
                console.log('登陆成功');
                this.heart();
                return;
            } else if (data.op == 12) {
                console.log("您已在其他设备登陆")
                return;
            } else if (data.op == 5) {
                //此处调用消息处理的方法
                if (data.body) {
                    if (data.body.msg) {
                        msg = data.body.msg;
                        msg.msg_content = JSON.parse(msg.msg_content);
                        msg.me = true;
                        console.log('发送成功:')
                        console.log(msg)
                        if (!msg.msg_type) {
                            //聊天消息
                            chat.receivetext(msg)
                        } else if (msg.msg_type == 1) {
                            //cmd消息
                            chat.receivecmd(msg)
                        } else if (msg.msg_type == 2) {
                            //系统消息
                            chat.receivesystem(msg)
                        }
                    } else {
                        console.log('数据错误');
                        return;
                    }
                } else {
                    console.log('发送数据格式错误')
                    return;
                }
            } else if (data.op == 9) {
                if (data.body) {
                    msg = data.body;
                    msg.msg_content = JSON.parse(msg.msg_content);
                    msg.me = false;
                    console.log('收到消息:')
                    console.log(msg)
                    if (!msg.msg_type) {
                        //聊天消息
                        chat.receivetext(msg)
                    } else if (msg.msg_type == 1) {
                        //cmd消息
                        chat.receivecmd(msg)
                    } else if (msg.msg_type == 2) {
                        //系统消息
                        chat.receivesystem(msg)
                    }
                }
            }
        }
        //发送消息
    this.send = function(body) {
        var data = {
            'ver': 1,
            'op': 4,
            'seq': this.seq++,
            'body': body
        }
        console.log('发送消息')
        console.log(data)
        data = JSON.stringify(data);
        this.ws.send(data)
    }
}
export default MpIMClient;
