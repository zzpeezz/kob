import { AcGameObject } from "./AcGameObject"; //引入刚才的基类
import { Snake } from "./Snake";
import { Wall } from "./Wall";
export class GameMap extends AcGameObject {
    constructor(ctx, parent) { //构造函数有两个初值，画布，画布的父元素用来动态修改我们画布的长宽。
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;  //存格子的绝对距离 L表示一个单位的长度
 
        this.rows = 13; //行
        this.cols = 14; //列

        this.inner_walls_count = 10; //内部障碍物的数量,因为是轴对称所以只随机一半就可以了
        this.walls = []; //创一个数组来存储我们所有的墙

        this.snakes = [
            new Snake({id: 0, color: "#4876ec", r: this.rows - 2, c: 1,}, this),
            new Snake({id: 1, color: "#f94847", r: 1, c: this.cols - 2,}, this),            
        ];
    }

    //判断是否联通
    check_connectivity(g, sx, sy, tx, ty) {  //地图，起点横纵坐标，终点横纵坐标
        if(sx == tx && sy == ty)    return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for(let i = 0; i < 4; i++ ){
            let x = sx + dx[i], y = sy + dy[i];

            if (x < 0 || x >= this.rows || y < 0 || y >= this.cols) continue;
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
            g[0][c] = g[this.rows - 1][c] = true;////上下两边再加上墙
        }
        //创建随机障碍物；随机的可能会重复，那就重新随机。
        for (let i = 0; i < this.inner_walls_count; i ++) {
            for (let j = 0; j < 1000; j ++) { //随机1000次总会找到
                let r = parseInt(Math.random() * this.rows); //行的随机值
                let c = parseInt(Math.random() * this.cols); // 列的随机值
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c] ) continue;  //对称放的,保证中心对称
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                       continue;//防止覆盖到左下角和右上角
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;  //对称
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

    add_listening_events() { //用来绑定事件
        this.ctx.canvas.focus();  //聚焦
        //获取用户输入
        const [snake0, snake1 ] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if(e.key === 'w') snake0.set_direction(0);
            else if(e.key === 'd') snake0.set_direction(1);
            else if(e.key === 's') snake0.set_direction(2);
            else if(e.key === 'a') snake0.set_direction(3);
            else if(e.key === 'ArrowUp') snake1.set_direction(0);
            else if(e.key === 'ArrowRight') snake1.set_direction(1);
            else if(e.key === 'ArrowDown') snake1.set_direction(2);
            else if(e.key === 'ArrowLeft') snake1.set_direction(3);
        });
        
    }
    start() {
        for(let i = 0; i < 1000; i ++)
            if(this.create_walls())
                break;
        this.add_listening_events();

    }
    update_size() {//每一帧都更新一下边长
        // clientWidth返回的是一个数字，表示元素的可见宽度，以像素为单位。
        // parseInt取整没有缝了
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows)); 
        this.ctx.canvas.width = this.L * this.cols;//画布的长度求出来了
        this.ctx.canvas.height = this.L * this.rows;
    }
    //判断两条蛇是否都准备好下一回合了
    check_ready() {
        for (const snake of this.snakes) {
            if(snake.status !== "idle") return false;   // 需要满足两条蛇都处于静止都走完了，
            if(snake.direction === -1)  return false;   // 同时两条蛇都获取了下一步操作的时候，表示已经准备好了。  
        }
        return true;
    }

    next_step() { // 让两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }
    check_valid(cell) { //检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) { //枚举障碍物
            if (wall.r === cell.r && wall.c === cell.c) 
                return false;   
        }
        for (const snake of this.snakes) {  //追自己蛇尾时，下一步有两种情况，可能缩了，也可能不缩
            let k = snake.cells.length;    //单独判断有没有缩的操作
            if (!snake.check_tail_increasing()) { //当蛇尾会前进的时候，蛇尾不要判断
                k --;
            }
            for (let i = 0; i < k; i ++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }
        return true;

    }
    update() {
        this.update_size ();
        if (this.check_ready()) { //是否准备好
            this.next_step();
        }
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