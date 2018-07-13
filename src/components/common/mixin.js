export const mixin = {
  methods: {
    plusReady() {
      mui.init({
        swipeBack: false
      });
      let first = null;
      mui.back = function () {
        if (!first) {
          first = new Date().getTime();
          mui.toast('再按一次退出应用');
          setTimeout(function () {
            first = null;
          }, 1000);
        } else {
          if (new Date().getTime() - first < 1000) {
            plus.runtime.quit();
          }
        }
      }
    },
    /**
     * 格式化距离
     * @param {*数值} d 
     */
    formatDis(d) {
      if (!d) return '未知';
      return d > 1000 ? `${(d / 1000).toFixed(2)}公里` : `${d}米`;
    },
    /**
     * 
     * @param {*时间戳} t 
     * @param {*类型} type 
     * 
     */
    formatTime(t, type) {
      var date, year, month, day, hour, minute, second;
      if (!t)
        return '--'
      date = new Date(t);
      /**
       * @param  {String} time 日期时间
       * @return {String}      格式化日期时间
       */
      var complete = function (time) {
        return time.toString().replace(/^(\d)$/, "0$1");
      };
      year = date.getFullYear();
      month = complete(date.getMonth() + 1);
      day = complete(date.getDate());
      hour = complete(date.getHours());
      minute = complete(date.getMinutes());
      second = complete(date.getSeconds());
      return type ? `${year}-${month}-${day} ${hour}:${minute}:${second}` : `${year}年${month}月${day}日 ${hour}:${minute}`;
    },
    /**
     * 格式化金额，返回两位小数
     * @param {*数值} m 
     */
    formatPrice(m, d = 2) {
      return (m || 0).toFixed(d);
    },
    /**
     * 格式化图片地址，默认图片
     * @param {*路径} path 
     */
    getImgPath(path) {
      return path ? path : (process.env.NODE_ENV == 'development' ? "/static/img/default.png" : "./static/img/default.png")
    },
    /**
     * 格式化图片地址，用户图片
     * @param {*路径} path 
     */
    formatUser(path) {
      return path ? path : (process.env.NODE_ENV == 'development' ? "/static/img/user.png" : "./static/img/user.png")
    },
    /**
     * 格式化背景图片,例如abc.png
     * @param {*图片名称} url
     */
    formatBg(url) {
      return process.env.NODE_ENV == 'development' ? `url(/static/img/${url})` : `url(./static/img/${url})`
    }
  }
}
export const localImg = {
  methods: {
    getLocalImg(filename) {
      return process.env.NODE_ENV == 'development' ? `/static/img/${filename}` : `./static/img/${filename}`
    }
  }
}
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

export const validateSettle = {
  computed: {
    validStoreName() {
      return !!this.storeName
    },
    validSellerName() {
      return !!this.sellerName
    },
    validSellerMobile() {
      return /^1[3,4,5,7,8,9]\d{9}$/.test(this.sellerMobile)
    },
    validStoreCitys() {
      return !!this.storeCitys.length;
    },
    validAddressDetail() {
      return !!this.addressDetail
    },
    validFileContent() {
      return !!this.fileContent
    },
  }
}

export const payMixin = {
  created() {
    this.getChannel();
  },
  methods: {
    getChannel() {
      plus.payment.getChannels(channels => {
        for (let i in channels) {
          var channel = channels[i];
          if (channel.id == "alipay" || channel.id == "wxpay") {
            this.pays[channel.id] = channel;
          }
        }
      });
    },
    checkService(pc, callback) {
      if (!pc.serviceReady) {
        var txt = null;
        switch (pc.id) {
          case "alipay":
            txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
            break;
          case "wxpay":
            txt = "系统未安装微信，无法完成支付，是否立即安装？";
            break;
        }
        plus.nativeUI.confirm(
          txt,
          function (e) {
            if (e.index == 0) {
              pc.installService();
            }
          },
          pc.description
        );
      } else {
        callback && callback();
      }
    }
  }
}
import {
  findMemberByMoblie
} from "../../api/index"
export const findMemberByMobile = {
  methods: {
    findMember() {

      if (!this.mobile || this.mobile.length < 11) {
        return;
      }
      let vm = this;
      mui.ajax({
        url: findMemberByMoblie,
        type: "post",
        headers: {
          "app-version": "v1.0"
        },
        data: {
          account: this.account,
          mobile: this.mobile,
          token: md5(`gjfengfindMemberByMoblie${this.mobile}`)
        },
        success(res) {
          if (res.code == 200) {
            vm.mobileName = res.result ? res.result.name || res.result.nickName : "用户不存在";
          } else {
            vm.mobileName = res.msg;
          }
        }
      });
    }
  }
}
export const time = {
  methods: {
    formatTime(date) {
      Date.prototype.format = function (p) {
        var o = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S": this.getMilliseconds()
        }
        if (/(y+)/.test(p)) {
          p = p.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(p)) {
            p = p.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
          }
        }
        return p;
      };

      function getFormatDate(date, pattern) {
        if (!date) {
          date = new Date();
        }
        if (!pattern) {
          pattern = "yyyy-MM-dd hh:mm:ss";
        }
        return date.format(pattern);
      };
      /*  转换long值为日期字符串
       *  l long值
       *  pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
       */
      function getFormatDateByLong(l, pattern) {
        return getFormatDate(new Date(l), pattern);
      };


      //时间格式转换
      // function returnDiyDate(date) {
      //date = parseInt(date);  //强转整型
      var tDate = getFormatDate(new Date(), "yyyy/MM/dd"); //当前凌晨时间(string)
      var tTime = new Date(tDate).getTime(); //当前凌晨时间(long)
      var eTime = 24 * 60 * 60 * 1000; //一天时间(long)
      var yTime = tTime - eTime; //昨天凌晨时间(long)
      var byTime = tTime - 2 * eTime; //前天凌晨时间(long)
      var formatDate = getFormatDateByLong(date, "hh:mm"); //转成时分格式
      var result = '';
      if (date >= tTime) {
        //今天
        result = formatDate;
      } else if (date < tTime && date >= yTime) {
        //昨天
        result = "昨天 " + formatDate;
      } else if (date < yTime && date >= byTime) {
        //前天
        result = "前天 " + formatDate;
      } else {
        //前天之前
        result = getFormatDateByLong(date, "MM-dd hh:mm");
      }
      return result;
      // };
    }
  }
}
