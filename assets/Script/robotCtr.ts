
import { _decorator, Component, Node, Sprite, Collider2D, Contact2DType, IPhysics2DContact, 
        input, Input,  EventKeyboard, KeyCode, Vec3, Animation, RigidBody2D} from 'cc';
import { BallCtr } from './BallCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = robotCtr
 * DateTime = Mon May 09 2022 10:57:33 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = robotCtr.ts
 * FileBasenameNoExtension = robotCtr
 * URL = db://assets/Script/robotCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('robotCtr')
export class robotCtr extends Component {

    @property({ type: Sprite })
    public ballSprite: Sprite | null = null;

    @property({ type: Component })
    public Sloth2: Component | null = null;

    @property({type: Animation})
    public animation: Animation | null = null;

    private isAction = false;
    private speed = 0;
    private moveSpeed = 0;
    private ActType: string;

    start () {
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {        
        if (otherCollider.name == "ball<CircleCollider2D>"){
            this.setBallCtr(this.ActType);
        }

        if (otherCollider.name == "tool<BoxCollider2D>"){
            this.node.emit('GetTool', this);
        }
    }

    setBallCtr(typr: string){
        if (this.ballSprite) {
            let nowPos = this.node.getPosition().x;
            let ballController = this.ballSprite.getComponent(BallCtr);
            let gv, rt, y: number;
            if (ballController.getBallFrame() == 0){
                gv = 3;
                rt = 1;
                y = -4;
            } else if (ballController.getBallFrame() == 1){
                gv = 1;
                rt = 2;
                y = -2;
            } else{
                gv = 0;
                rt = 0;
                y = 0;
            }  

            if (this.ActType == "jump"){
                if (nowPos > 350){
                    ballController.setBalllv(-17, -5 + y, 7 + gv, 0 + rt);
                } else if (nowPos < 100) {
                    ballController.setBalllv(-10, -10 + y, 9 + gv, 0 + rt);
                } else {
                    ballController.setBalllv(-14, -8 + y, 8 + gv, 0 + rt);
                }
            } else if (this.ActType == "lean"){
                if (nowPos > 350) {
                    ballController.setBalllv(-17, 10 - y, 1 + gv, 1 + rt);
                } else if (nowPos < 100){
                    ballController.setBalllv(-10, 4 - y, 1 + gv, 1 + rt);
                } else {
                    ballController.setBalllv(-14, 6 - y, 1 + gv, 1 + rt);
                }
            } else {
                ballController.setBalllv(-20, 15 + y, 0.5 + gv, 1 + rt);
            }
        }        
    }

    setRigidBody(type, x, y, gv: number){
        this.node.getComponent(RigidBody2D).type = type;
        let lv = this.node.getComponent(RigidBody2D).linearVelocity;
        lv.x = x == null ? lv.x : x;
        lv.y = y == null ? lv.y : y;
        this.node.getComponent(RigidBody2D).linearVelocity = lv;
        this.node.getComponent(RigidBody2D).gravityScale = gv;
    }

    update (deltaTime: number) {
        if (this.isAction){
            this.speed += deltaTime;
            if (this.speed >= 0.85){
                this.isAction = false;
                this.ActType = "ini";
                this.speed = 0;
                this.setRigidBody(2, 0, 0, 50);
            }
        }else {
            if (this.ballSprite){
                this.moveSpeed += deltaTime;
                let robotPos = this.node.getPosition();
                let ballPos = this.ballSprite.node.getPosition();
                let rangX = robotPos.x - ballPos.x > 0 ? robotPos.x - ballPos.x : -(robotPos.x - ballPos.x);
                if (ballPos.x > 70 && ballPos.x < 400){
                    if (this.moveSpeed > 0.06){    
                        if (rangX > 30) {
                            if (rangX > 80) {
                                this.ActType = "lean";
                                if (robotPos.x > ballPos.x){
                                    this.setRigidBody(2, -50, null, 7);
                                } else{
                                    this.setRigidBody(2, 50, null, 7);
                                }
                            } else {
                                if (robotPos.x > ballPos.x){
                                    this.setRigidBody(2, -30, null, 7);
                                } else{
                                    this.setRigidBody(2, 30, null, 7);
                                }
                            }
                            setTimeout(() => {
                                this.setRigidBody(2, 0, 0, 50);
                            }, 20);
                        } else {
                            if (ballPos.y < 120 && ballPos.y > -150){
                                this.setRigidBody(2, null, 43, 10);
                                this.isAction = true;
                                this.ActType = "jump";
                            }
                        }
                        this.moveSpeed = 0;
                    } 
                }
            }
        }
    }
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
