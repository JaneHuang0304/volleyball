
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
        if (otherCollider.name == "ball<BoxCollider2D>"){
            this.setBallCtr(this.ActType);
        }
    }

    setBallCtr(typr: string){
        if (this.ballSprite) {
            let ballController = this.ballSprite.getComponent(BallCtr);
            if (this.ActType == "jump"){
                ballController.setBalllv(-15, -2, 8, 1);
            }else{
                ballController.setBalllv(-13, 10, 1.5, 1);
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
            if (this.speed >= 0.8){
                this.isAction = false;
                this.ActType = "ini";
                this.speed = 0;
                this.setRigidBody(2, 0, 0, 30);
            }
        }else {
            if (this.ballSprite){
                this.moveSpeed += deltaTime;
                let robotPos = this.node.getPosition();
                let ballPos = this.ballSprite.node.getPosition();
                let ballbody = this.ballSprite.node.getComponent(RigidBody2D).linearVelocity;
                let rangX = robotPos.x - ballPos.x > 0 ? robotPos.x - ballPos.x : -(robotPos.x - ballPos.x);
                if (ballPos.x > 70 && ballPos.x < 400){
                    if (this.moveSpeed > 0.06){    
                        if (rangX > 30) {
                            if (rangX > 80) {
                                this.ActType = "lean";
                                if (robotPos.x > ballPos.x){
                                    this.setRigidBody(2, -80, null, 7);
                                } else{
                                    this.setRigidBody(2, 80, null, 7);
                                }
                            } else {
                                if (robotPos.x > ballPos.x){
                                    this.setRigidBody(2, -30, null, 7);
                                } else{
                                    this.setRigidBody(2, 30, null, 7);
                                }
                            }
                            setTimeout(() => {
                                this.setRigidBody(2, 0, 0, 30);
                            }, 10);
                        } else {
                            if (ballPos.y < 130 && ballPos.y > 90){
                                this.setRigidBody(2, null, 40, 10);
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
