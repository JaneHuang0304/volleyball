
import { _decorator, Component, Node, Sprite, Label, Vec3, Prefab } from 'cc';
import { TableCtr } from './TableCtr';
import { BallCtr } from './BallCtr';
import { PlayerCtr } from './PlayerCtr';
import { robotCtr } from './robotCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GamerCtr
 * DateTime = Wed May 04 2022 11:59:46 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = GamerCtr.ts
 * FileBasenameNoExtension = GamerCtr
 * URL = db://assets/Script/GamerCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('GameCtr')
export class GameCtr extends Component {

    @property({type: PlayerCtr})
    public PlayerCtrl: PlayerCtr | null = null;

    @property({type: robotCtr})
    public robotCtrl: robotCtr | null = null;   

    @property({type: TableCtr})
    public tableCtrl: TableCtr | null = null;

    @property({type: Label})
    public Scorelab: Label | null = null;

    @property({type: Label})
    public robotScorelab: Label | null = null;

    @property({type: Label})
    public readylab: Label | null = null;

    @property({ type: Sprite })
    public ballSprite: Sprite | null = null;

    @property({ type: Sprite })
    public startMenu: Sprite | null = null;

    private Score = 0;
    private robtoScore = 0;
    private isSetlv = true;

    start () {
        this.tableCtrl?.node.on('TableRet', this.onTableRet, this);
    }

    async onButtonClick(){
        if (this.startMenu){
            this.startMenu.node.active = false;
            this.readylab.string = `Ready!`;
            this.readylab.node.active = true;
            this.isSetlv = true;
            await this.onReSet("left");
        }
    }

    async onTableRet(location: string){
        let startLoc: string;
        
        if (location == 'left') {
            this.robtoScore += 1;
            startLoc = "right";
        }

        if (location == 'right') {
            this.Score += 1;
            startLoc = "left";
        }

        if (this.Score == 10 || this.robtoScore == 10) {
            this.onEndGame();
        }else {
            if (this.Scorelab) {
                this.Scorelab.string = `${this.Score}`;
            }
    
            if (this.robotScorelab){
                this.robotScorelab.string = `${this.robtoScore}`;
            }
            this.readylab.node.active = true;
            await this.onReSet(startLoc);
        }
    }

    async onReSet(start: string){
        let ballPos = new Vec3();
        let ballController: BallCtr;

        if (this.robotCtrl){
            this.robotCtrl.isStart = true;
        }

        if (this.ballSprite) {
            ballController = this.ballSprite.getComponent(BallCtr);
            ballController.setBalllv(0, 0, 0); 
        }   

        if (start == "right"){
            ballPos = new Vec3(224, 242, 0);
        } 
        if (start == "left"){
            ballPos = new Vec3(-224, 242, 0);
        }

        if (this.ballSprite){
            setTimeout(() => {
                this.ballSprite.node.setPosition(ballPos);
            }, 1);
        }

        if (this.PlayerCtrl){
            setTimeout(() => {
                this.PlayerCtrl.node.setPosition(new Vec3(-215, -173, 0));
            }, 1);
        }

        if (this.robotCtrl){
            setTimeout(() => {
                this.robotCtrl.node.setPosition(new Vec3(280, -173, 0));
            }, 1);
        }
        
        return new Promise((resolve, reject) => {
            if (this.isSetlv){
                setTimeout(() => {
                    if (this.readylab){
                        this.readylab.node.active = false;
                    }
                    ballController.setBalllv(0, 4, 1); 
                    resolve("");               
                }, 500);
            }else{
                resolve("");
            }
        }); 
    }

    async onEndGame(){
        this.isSetlv = false;
        this.Score = 0;
        this.robtoScore = 0;
        if (this.Scorelab) {
            this.Scorelab.string = `${this.Score}`;
        }

        if (this.robotScorelab){
            this.robotScorelab.string = `${this.robtoScore}`;
        }

        this.readylab.string = `EndGame!`;
        this.startMenu.node.active = true;
        await this.onReSet("left");
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
