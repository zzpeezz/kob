const AC_GAME_OBJECTS = [];//先把所有游戏对象存起来,存到这里面

export class AcGameObject { //基类
    constructor() {  //构造函数
        AC_GAME_OBJECTS.push(this); //加进去，每创建一个就push一个，所以先创建先push，先创建的先执行updata，后创建的会把先创建的覆盖掉
        this.timedelta = 0;  //这一帧执行的时刻具体上一帧执行的时刻的时间间隔，速度需要这个
        this.has_called_start = false;//记录下有没有执行过
    }
    start() { //只执行一次。创建的时候执行

    }
    update() { //每一帧执行一次,除了第一帧之外

    }
    on_destory() { //删除之前执行

    }
    destory() { //将当前对象从AC_GAME_OBJECTS里面删掉
        this.on_destory();

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i]; //取出来
            if (obj === this) {  //判断数组里的这个对象 obj，是不是正在执行 destory() 方法的那个对象
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp; //上一帧执行的时刻
const step = timestamp => {  //让他每一帧都执行，递归  //timestamp当前函数执行的时刻
        for (let obj of AC_GAME_OBJECTS) {//of遍历值，in遍历下标
            if (!obj.has_called_start) {
                obj.has_called_start = true;   //没有执行过
                obj.start();
            }
            else {
                obj.timedelta = timestamp - last_timestamp;  //执行过，计算delta
                obj.update();
            }
        }//每个对象都判断完之后  
        last_timestamp = timestamp;
        requestAnimationFrame(step)     //传一个回调函数，在下一帧浏览器渲染之前执行一遍
                                        //原生 API。下一次屏幕刷新之前，帮我运行一下 step 这个函数
};
        requestAnimationFrame(step);  //启动第一帧（关键）

