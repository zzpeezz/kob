//蛇里面的一个格子
export class Cell {  
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.x = c + 0.5;   //转换坐标，因为数组坐标系和画布坐标系相反
        this.y = r + 0.5;


    }



}