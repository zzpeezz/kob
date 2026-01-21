import { AcGameObject } from "./AcGameObject"; //引入刚才的基类
import { Wall } from "./Wall";
export class GameMap extends AcGameObject {
    constructor(ctx, parent) { //构造函数有两个初值，画布，画布的父元素用来动态修改我们画布的长宽。
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;  //存格子的绝对距离 L表示一个单位的长度
 
        this.rows = 13; //行
        this.cols = 13; //列

        this.inner_walls_count = 10; //内部障碍物的数量,因为是轴对称所以只随机一半就可以了
        this.walls = []; //创一个数组来存储我们所有的墙
    }

    //判断是否联通
    check_connectivity(g, sx, sy, tx, ty) {  //地图，起点横纵坐标，终点横纵坐标
        if(sx == tx && sy == ty)    return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 1, -1];
        for(let i = 0; i < 4; i++ ){
            let x = sx + dx[i], y = sy + dy[i];
            if(!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }
        return false;
    }
    create_walls() {
        const g = [];  //开一个bool数组有墙的话是true没有就是false
        for (let r = 0; r < this.rows; r ++ ) {
                g[r] = []; //每行给他赋一个数组
            for(let c = 0; c < this.cols; c ++) {
                g[r][c] = false;
            }
        }
            
         //给四周加上障碍物
        for (let r = 0; r < this.rows; r ++) {
            g[r][0] = g[r][this.cols - 1] = true; //左右两边先加上墙
        }
        for (let c = 0; c <this.cols; c ++){
            g[0][c] = g[this.cols - 1][c] = true;////上下两边再加上墙
        }
        //创建随机障碍物；随机的可能会重复，那就重新随机。
        for (let i = 0; i < this.inner_walls_count; i ++) {
            for (let j = 0; j < 1000; j ++) { //随机1000次总会找到
                let r = parseInt(Math.random() * this.rows); //行的随机值
                let c = parseInt(Math.random() * this.cols); // 列的随机值
                if (g[r][c] || g[c][r] ) continue;  //对称放的
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                       continue;//防止覆盖到左下角和右上角
                g[r][c] = g[c][r] = true;
                break;
            }
        }
        const copy_g = JSON.parse(JSON.stringify(g)); //复制

        if(!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2 ))    return false;
        for (let r = 0; r < this.rows; r ++) {
            for(let c = 0; c < this.cols; c ++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this)); //创建了一个Wall对象，
                }
            }
        }
        return true;
    }

    start() {
        for(let i = 0; i < 1000; i ++)
            if(this.create_walls())
                break;

    }
    update_size() {//每一帧都更新一下边长
        // clientWidth返回的是一个数字，表示元素的可见宽度，以像素为单位。
        // parseInt取整没有缝了
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows)); 
        this.ctx.canvas.width = this.L * this.cols;//画布的长度求出来了
        this.ctx.canvas.height = this.L * this.rows;
    }
    update() {
        this.update_size ();
        this.render();
    }

    render() { //渲染,把我们当前的游戏对象画到地图上
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); //前两个表示起点(左上角)坐标，后两个表示边长
        const color_even = "#aad751", color_odd = "#a2d149";//前偶后奇
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);  //和平常的相反，横坐标是c 
            }
        }
    }

}