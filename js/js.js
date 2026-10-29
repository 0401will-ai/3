$(function () {
    let islog = false;
    const app = {
        toast(message, type = "success", delay = 4000) {
            const all = ["success", "danger", "primary", "warning", "secondary"];
            const ait = all.includes(type) ? type : "success";
            let $box = $(".app-t");
            if (!$box.length) {
                $box = $(` <div class="app-t pf z-max bottom-0 start-0 ms-md-5 ms-2 p-3"></div>`).appendTo("body");
            }
            const $t = $(`
<div class="toast text-bg-${ait} border-0 shadow my-1" style="width: 300px;">
        <div class="d-fxcc jcs">
            <div class="toast-body"></div>
            <button class="btn-close m-auto me-2" data-bs-dismiss="toast"></button>
        </div>
    </div>                
                `).appendTo($box);
            $t.find(".toast-body").html(message);
            const newtoast = new bootstrap.Toast($t[0], delay);
            $t.one("hidden.bs.toast", () => $t.remove());
            newtoast.show();
        }
    }
    function rlog() {
        if (islog) {
            return true;
        }
        app.toast('請先登入會員，才能使用這個功能。     <button class="btn bg-c0 rounded-pill toastlogin" data-bs-dismiss="toast">一鍵登入</button>', "danger");
    }
    function setlog(loggedIn) {
        islog = loggedIn;
        $("#aimsg,#aibtnmsg").prop("disabled", !loggedIn);
        if (!loggedIn) {
            $("#aimsg").val("");
        }
        $("#aimsg").attr("placeholder", loggedIn ? "請輸入訊息" : "請先登入會員");
        const $logbtn = $(".logbtn");
        if (loggedIn) {
            $logbtn.removeClass("bg-c1").addClass("bg-success").html('<i class="fa-solid fa-user me-1"></i>登出');
            $("#user").modal("show");
        } else {
            $logbtn.removeClass("bg-success").addClass("bg-c1").html('<i class="fa-solid fa-user me-1"></i>登入');
        }
    }
    $(".logbtn").on("click", function () {
        if (islog) {
            setlog(false);
            return;
        }
        setlog(true);
    });
    $(document).on("click", ".toastlogin", function () {
        setlog(true);
    });
    $(window).on("scroll", function () {
        const $h = $(".header");
        const a = this.scrollY > 10;
        const aa = this.scrollY > 500;
        $h
            .toggleClass("a1", a)
            .toggleClass("a2", !a);
        if (aa) {
            $(".top").fadeIn(500);
        } else {
            $(".top").fadeOut(500);
        }
    }).trigger("scroll");
    function r() {
        $(".resveal , .resveal1 , .resveal2 , .resveal21 , .resveal3 , .resveal31 , .resveal01").each(function () {
            const tot = $(this).offset().top;
            const wstwh = $(window).scrollTop() + $(window).height();
            if (tot < wstwh - 50) {
                $(this).addClass("r-show");
            } else {
                $(this).removeClass("r-show");
            }
        });
    }
    $(window).on("scroll", r);
    function num() {
        const $ns = $(".numbers");
        if ($ns.length === 0) {
            return;
        }
        const tot = $ns.offset().top;
        const wstwh = $(window).scrollTop() + $(window).height();
        if (tot < wstwh) {
            const $num = $ns.find(".num");
            $num.each(function () {
                const $n = $(this);
                const $nd = $n.data("num");
                $({ number: 0 }).animate({ number: $nd }, {
                    duration: 3000,
                    step: function () {
                        $n.text(Math.floor(this.number));
                    },
                    complete: function () {
                        $n.text($nd);
                    }
                });
            });
            $(window).off("scroll", num);
        }
    }
    $(window).on("scroll", num);
    const cart = [];
    $(".addbuy").on("click", function () {
        if (!rlog()) {
            return;
        }
        const p = $(this).closest(".product");
        const pname = p.find(".pr-name").text();
        const pmoney = parseFloat(p.find(".pr-money").text().replace("NT$", ""));
        const pimg = p.find(".pr-img").attr("src");
        const pnum = p.find(".pr-num");
        let pnums = parseInt(pnum.text(), 10);
        if (pnums === 0) {
            alert("東西沒了");
            return;
        }
        $(".shop").addClass("fa-shake");
        setTimeout(() => {
            $(".shop").removeClass("fa-shake");
        }, 500);
        app.toast("已加入購物車", "primary");
        const ex = cart.find((item) => item.name === pname);
        if (ex) {
            ex.buynum++;
            pnums--;
        } else {
            cart.push(
                {
                    name: pname,
                    money: pmoney,
                    buynum: 1,
                    img: pimg,
                }
            );
            pnums--;
        }
        pnum.text(pnums);
        upcart();
    });
    function upcart() {
        const buys = $(".c-buys");
        const cmoney = $(".c-money");
        const cnum = $(".c-num");
        buys.empty();
        let tmoney = 0;
        let num = 0;
        if (cart.length === 0) {
            buys.append(' <div class="card p-3">購物車還沒有商品</div>');
        }
        for (const item of cart) {
            const $row = $(`
    <div class="card list-group-item pr my-1">
        <div class="d-fxcc jcs">
            <img src="${item.img}" alt="" class="c-i-img w-25 h-100 object-fit-cover rounded-3">
            <div class="px-2">
                <div class="fs-6 fw-bolder c-i-name">${item.name}</div>
                <div class="fs-6 c-i-num">人數:${item.buynum}</div>
            </div>
        </div>
        <div class="pa h-100 d-fxcc end-0 top-0">
            <div class="c-i-money  bg-gra p-2 m-1 rounded-2 t-c0">NT$${item.money * item.buynum}</div>
        </div>
    </div>                    
                `);
            buys.append($row);
            tmoney += item.money * item.buynum;
            num += item.buynum;
        }
        cmoney.text(`NT$${tmoney.toFixed(2)}`);
        cnum.text(num);
    }
    upcart();
    $(".shop").on("click", function () {
        if (!rlog()) {
            return;
        }
        $("#buy").modal("show");
    });
    $(".buyyes").on("click", function () {
        if (!rlog()) {
            return;
        }
        if (cart.length === 0) {
            app.toast("請先報名在確定", "warning");
            return;
        }
        cart.length = 0;
        upcart();
        $("#buy").modal("hide");
        $("#buyyes").modal("show");
    });

    const md = [
        {
            name: "台北lina",
            text: "吃得好飽！",
            likes: 94
        },
        {
            name: "台中lucky",
            text: "雲海超壯觀！",
            likes: 43
        },
        {
            name: "台南DECO",
            text: "整片金黃色地毯！",
            likes: 478
        },
        {
            name: "新北CEO",
            text: "一路上的人情味無價！",
            likes: 520
        },
        {
            name: "輝達",
            text: "水質清澈還看到海龜！",
            likes: 274
        },
        {
            name: "綠黨賴清德",
            text: "麵茶牛舌餅絕配！",
            likes: 80
        },
    ];
    const $name = $("#name");
    const $text = $("#text");
    const $msgs = $(".msgs");
    function esh(text) {
        return $("<div>").text(text).html();
    }
    function ct(data) {
        const hn = data.name.charAt(0);
        const left = Math.floor(Math.random() * 80) + "%";
        const move = Math.floor(Math.random() * 80) + "px";
        const time = Math.floor(Math.random() * 20) + 5 + "s";
        const $msgbox = $(`
<div class="msg pa z-0 card px-3 py-2 bg-wt blur shadow rounded-4" style="
    --left:${left};
    --move:${move};
    --time:${time};
    ">
        <div class="d-fxcc jcs">
            <div class="bg-gra shadow rounded-pill d-fxcc t-c0" style="width: 40px;height: 40px;">
                ${esh(hn)}
            </div>
            <div class="px-2">
                <div class="fw-bolder">${esh(data.name)}</div>
                <div class="" style="transform: scale(0.8);">剛剛</div>
            </div>
        </div>
        <div class="t-bt">${esh(data.text)}</div>
        <div class="d-fxcc jce">
            <button class="btn border-0 like t-bt">
                <span>${esh(data.likes)}</span>
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
    </div>            
            `);
        $msgs.append($msgbox);
        $msgbox.one("animationend", function () {
            $(this).remove();
        });
    }
    md.forEach(function (message, index) {
        setTimeout(() => {
            ct(message);
        }, index * 700);
    });
    setInterval(() => {
        const ran = md[Math.floor(Math.random() * md.length)];
        ct({
            name: ran.name,
            text: ran.text,
            likes: ran.likes,
        });
    }, 1000);
    function msg() {
        if (!rlog()) {
            return;
        }        
        const name = $name.val().trim();
        const text = $text.val().trim();
        let v = true;
        if (!name) {
            $name.addClass("is-invalid");
            v = false;
        } else {
            $name.removeClass("is-invalid");
        }
        if (!text) {
            $text.addClass("is-invalid");
            v = false;
        } else {
            $text.removeClass("is-invalid");
        }
        if (!v) {
            return;
        }
        const newmsg = {
            name: name,
            text: text,
            likes: 0
        };
        md.push(newmsg);
        ct(newmsg);
        $name.val("");
        $text.val("");
        $("#msgcard").collapse("hide");
    }
    $name.keypress(function (e) {
        if (e.which === 13) {
            $text.focus();
        }
    });
    $text.keypress(function (e) {
        if (e.which === 13) {
            msg();
        }
    });
    $(".msgbtn").on("click", function () {
        msg();
    });
    $msgs.on("click", ".like", function () {
        const $btn = $(this);
        const $num = $btn.find("span");
        let num = parseInt($num.text(), 10);
        if ($btn.hasClass("t-r")) {
            $btn.toggleClass("t-r t-bt");
            num--;
        } else {
            num++;
            $btn.toggleClass("t-r t-bt");
            $btn.addClass("fa-bounce");
            setTimeout(() => {
                $btn.removeClass("fa-bounce");
            }, 1000);
        }
        $num.text(num);
    });
    $(".aibtn").on("click", function () {
        if (!rlog()) {
            return;
        }
        $(".AI").fadeToggle(400);
    });
    $("#aibtnmsg").on("click", smsg);
    $("#aimsg").keypress(function (e) {
        if (e.which === 13) {
            smsg();
        }
    });
    function smsg() {
        if (!rlog()) {
            return;
        }
        let msg = $("#aimsg").val().trim();
        if (!msg) {
            return;
        }
        usermsg(msg);
        $("#aimsg").val("");
        setTimeout(() => {
            aimsg(getmsg(msg.toLowerCase()));
        }, 300);
    }
    function getmsg(input) {
        let rmsg = {
            你好: "您好 !",
        };
        return rmsg[input] || "抱歉，暫時無法回覆消息";
    }
    function usermsg(text) {
        const $msg = $(`
    <div class="d-fxcc jce">
        <div class="userbox text-bg-primary p-2 h6"></div>
    </div>            
            `);
        $msg.find(".userbox").text(text).append(`
    <i class="fa-solid fa-user mx-1"></i>                    
                `);
        $(".ax").append($msg);
        scrbottom();
    }
    function aimsg(text) {
        const $msg = $(`
      <div class="aimsg text-bg-dark p-2 fs-6 my-1">
          <i class="fa-solid fa-robot mx-1"></i>          
      </div>           
            `);
        $msg.append(document.createTextNode(text));
        $(".ax").append($msg);
        scrbottom();
    }
    function scrbottom() {
        $(".ax").scrollTop($(".ax")[0].scrollHeight);
    }
    let ac = 0;
    const $cards = $(".card3d");
    const cs = $cards.length;
    function card3d() {
        $cards.each(function () {
            const $card = $(this);
            const card = $card.data("in");
            let o = card - ac;
            if (o < -2) {
                o += cs;
            }
            if (o > 2) {
                o -= cs;
            }
            if (o === 2) {
                $card.css({
                    "transform": " translate3d(100%,0,0) scale(0.5) rotateY(-55deg)",
                    "opacity": "0.3",
                    "z-index": "1"
                });
            }
            else if (o === 1) {
                $card.css({
                    "transform": " translate3d(50%,0,0) scale(0.7) rotateY(-35deg)",
                    "opacity": "0.6",
                    "z-index": "2"
                });

            }
            else if (o === 0) {
                $card.css({
                    "transform": " translate3d(0%,0,0) scale(1) rotateY(0deg)",
                    "opacity": "1",
                    "z-index": "5"
                });

            }
            else if (o === -1) {
                $card.css({
                    "transform": " translate3d(-50%,0,0) scale(0.7) rotateY(35deg)",
                    "opacity": "0.6",
                    "z-index": "2"
                });

            }
            else if (o === -2) {
                $card.css({
                    "transform": " translate3d(-100%,0,0) scale(0.5) rotateY(55deg)",
                    "opacity": "0.3",
                    "z-index": "1"
                });

            }
            else {

                $card.css({
                    "transform": " translate3d(0%,0,0) scale(0) rotateY(0deg)",
                    "opacity": "0",
                    "z-index": "0"
                });
            }
        });
    }
    card3d();
    $("#btn3dprev").on("click", function () {
        ac = (ac + 1) % cs;
        card3d();
    });
    $("#btn3dnext").on("click", function () {
        ac = (ac - 1) % cs;
        card3d();
    });
});