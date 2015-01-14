'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// 网站全局配置
var Config = new Schema({

    // 配置的名称，用于区分不同的配置。
    name: {
        type: String,
        unique: true
    },

    host: {
        admin: String,              //动梨后台的域名
        product: String             //动梨网站(客户使用)的域名
    },
    // 企业注册是否需要邀请码
    company_register_need_invite: {
        type: Boolean,
        default: true
    },
    push:{
        status:{
            type:String,
            enum:['on','off'],
            default:'off'
        },
        baidu:{
            ak:String,
            sk:String,
            single:{
                type:Boolean,
                default:true
            }
        },
        apn: {
            push: {
                gateway: String,
                port: String
            },
            feedback: {
                gateway: String,
                port: String,
                interval: Number // 获取推送结果的间隔，单位为秒
            },
            cert_path: String,
            key_path: String,
            passphrase: String
        }
    },

    smtp: {
        type: String,
        enum: ['163', 'webpower', 'sendcloud']
    }
});

mongoose.model('Config', Config);
