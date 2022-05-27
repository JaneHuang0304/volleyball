
import { _decorator, Component, Node, Sprite, Label, Vec3, Prefab, PhysicsSystem2D, resources, SpriteFrame, instantiate, 
        input, Input, EventKeyboard, KeyCode } from 'cc';
import { TableCtr } from './TableCtr';
import { BallCtr } from './BallCtr';
import { PlayerCtr } from './PlayerCtr';
import { robotCtr } from './robotCtr';
import { ToolCtr } from './ToolCtr';
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

    @property({ type: Sprite })
    public BGSprite: Sprite | null = null;

    @property({ type: Prefab })
    public ToolPrefab: Prefab | null = null;

    private Score = 0;
    private robtoScore = 0;
    private isSetlv = true;
    private tool: Node;

    start () {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.debugDrawFlags = 1;
        this.tableCtrl?.node.on('TableRet', this.onTableRet, this);
        this.tableCtrl?.node.on('TableRet', this.onTableRet, this);
        this.robotCtrl?.node.on('GetTool', this.onGetTool, this);
        this.PlayerCtrl?.node.on('GetTool', this.onGetTool, this);
        if (this.startMenu.node.active == true){
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    }

    onKeyDown(event: EventKeyboard) {
        let Pos = this.node.getPosition();
        switch(event.keyCode){
            case KeyCode.ENTER:
                this.onButtonClick();
                break;
        }  
    }

    onGetTool(){
        let rand = Math.floor(Math.random()*2);
        let picUrl: string;
        if (rand == 0) {
            picUrl = 'ball2/spriteFrame';
        } else {
            picUrl = 'ball3/spriteFrame';
        }
        this.setBallType(picUrl);

        setTimeout(() => {
            this.tool.active = false;
            this.tool = undefined;
            this.node.removeChild(this.tool);
        }, 1);
    }

    async onButtonClick(){
        if (this.startMenu){
            this.Score = 0;
            this.robtoScore = 0;
            if (this.Scorelab) {
                this.Scorelab.string = `${this.Score}`;
            }
    
            if (this.robotScorelab){
                this.robotScorelab.string = `${this.robtoScore}`;
            }
            let picUrl = 'back/spriteFrame';
            this.setBG(picUrl);
            this.startMenu.node.active = false;
            this.readylab.string = `Ready!`;
            this.readylab.node.active = true;
            this.isSetlv = true;
            await this.onReSet("left");
        }
    }

    async onTableRet(location: string){
        let startLoc: string;
        let ballController = this.ballSprite.getComponent(BallCtr);
        
        if (location == 'left') {
            this.robtoScore += 1;
            startLoc = "right";
        }

        if (location == 'right') {
            this.Score += 1;
            startLoc = "left";
        }

        if (ballController.getBallFrame() > -1){
            let picUrl = 'ball/spriteFrame';
            this.setBallType(picUrl);
        }

        if (this.Score >= 5 || this.robtoScore >= 5){
            let picUrl = 'Bg2/spriteFrame';
            this.setBG(picUrl);
        }

        if (this.tool == undefined){
            if (this.Score - this.robtoScore >= 3){
                setTimeout(() => {
                    this.setTool("right");
                }, 1);
            } else if (this.Score - this.robtoScore <= -3){
                setTimeout(() => {
                    this.setTool("left");
                }, 1);
            } 
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

    setBG(pic: string){
        resources.load(pic, SpriteFrame, (err: any, spriteFrame) => {
            let sprite = this.BGSprite.getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
         });
    }

    setBallType(pic: string){
        resources.load(pic, SpriteFrame, (err: any, spriteFrame) => {
            let sprite = this.ballSprite.getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
         });
    }

    setTool(location: string){
        if (this.ToolPrefab){
            this.tool = instantiate(this.ToolPrefab);
            let toolController = this.tool.getComponent(ToolCtr); 
            this.node.addChild(this.tool); 
            let setPos: Vec3;

            if (location == "right") {
                let Pos = this.robotCtrl.node.getPosition().x;
                if (Pos < 72){
                    setPos = new Vec3(Pos + 100, -270, 0);
                } else if (Pos > 400){
                    setPos = new Vec3(Pos - 100, -270, 0);
                } else {
                    if (Pos > 224){
                        setPos = new Vec3(Pos - 100, -270, 0);
                    } else {
                        setPos = new Vec3(Pos + 100, -270, 0);
                    }
                }
                toolController.node.setPosition(setPos);
            }
    
            if (location == "left") {
                let Pos = this.PlayerCtrl.node.getPosition().x;
                if (Pos < -400) {
                    setPos = new Vec3(Pos + 100, -270, 0);
                } else if (Pos > -90) {
                    setPos = new Vec3(Pos - 100, -270, 0);
                } else {
                    if (Pos > -224) {
                        setPos = new Vec3(Pos - 100, -270, 0);
                    } else {
                        setPos = new Vec3(Pos + 100, -270, 0);
                    }
                }
                toolController.node.setPosition(setPos);
            }
        }
    }

    async onReSet(start: string){
        let ballPos = new Vec3();
        let ballController: BallCtr;

        if (this.ballSprite) {
            ballController = this.ballSprite.getComponent(BallCtr);
            ballController.setBalllv(0, 0, 0, 1); 
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
                this.PlayerCtrl.setRigidBody(2, 0, 0, 30);
                this.robotCtrl.setRigidBody(2, 0, 0, 30);
            }, 1);
        }
        
        return new Promise((resolve, reject) => {
            if (this.isSetlv){
                setTimeout(() => {
                    if (this.readylab){
                        this.readylab.node.active = false;
                    }
                    ballController.setBalllv(0, 4, 1, 1); 
                    resolve("");               
                }, 500);
            }else{
                resolve("");
            }
        }); 
    }

    onEndGame(){
        this.isSetlv = false;
        this.readylab.string = `EndGame!`;
        this.ballSprite.node.setPosition(new Vec3(-224, 242, 0));
        let ballCtr = this.ballSprite.getComponent(BallCtr);
        ballCtr.setBalllv(0, 0, 0, 0); 
        
        setTimeout(() => {
            this.startMenu.node.active = true;
        }, 2500);
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
