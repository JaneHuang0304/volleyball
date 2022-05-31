
import { _decorator, Component, Node, RigidBody2D, Vec3, Sprite, Collider2D, Contact2DType, IPhysics2DContact, CircleCollider2D} from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BallCtr
 * DateTime = Wed May 04 2022 16:09:14 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = BallCtr.ts
 * FileBasenameNoExtension = BallCtr
 * URL = db://assets/Script/BallCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('BallCtr')
export class BallCtr extends Component {

    private StartLocation: string;

    start () {
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let gv, rt, y: number;
        let PosY = this.node.getPosition().y;

        if (this.getBallFrame() == 0){
            gv = 3;
            rt = 1;
            y = -4;
        } else if (this.getBallFrame() == 1){
            gv = 1;
            rt = 2;
            y = -2;
        } else {
            gv = 0;
            rt = 0;     
            y = 0;      
        }

        if (otherCollider.name == "PlayerManager<PolygonCollider2D>"){
            this.StartLocation = "left";
        }

        if (otherCollider.name == "RobotManager<PolygonCollider2D>"){
            this.StartLocation = "right";
        }

        if (otherCollider.name == "top<BoxCollider2D>"){         
            if (this.StartLocation == "right"){
                this.setBalllv(-20, -3 + y, 5 + gv, 0.5 + rt);
            } else {
                this.setBalllv(20, -3 + y, 5 + gv, 0.5 + rt);
            }
        }  

        if (otherCollider.name == "Racket<BoxCollider2D>"){
            this.setBalllv(20, -10 + y, 5 + gv, 0.5 + rt);
        }

        if (otherCollider.name == "right<BoxCollider2D>" || otherCollider.name == "left<BoxCollider2D>"){
            if (PosY <= -130){
                this.setBalllv(0, 0, 4, 0.2);
            } else {
                this.setBalllv(18, -3 + y, 4 + gv, 0.5 + rt);
            }
        }

        if (otherCollider.name == "net<BoxCollider2D>") {
            this.setBalllv(0, 0, 4, 0.2);
        }

        console.log(`lv:: ${this.node.getComponent(RigidBody2D).linearVelocity}`);
        console.log(`gv:: ${this.node.getComponent(RigidBody2D).gravityScale}`);
        console.log(`rt:: ${this.node.getComponent(CircleCollider2D).restitution}`);
     }

    setBalllv(x, y, gv, rt: number){
        let lv = this.node.getComponent(RigidBody2D).linearVelocity;
        lv.x = x == null ? lv.x : x;
        lv.y = y == null ? lv.y : y;
        this.node.getComponent(RigidBody2D).linearVelocity = lv;    
        this.node.getComponent(RigidBody2D).gravityScale = gv;  
        this.node.getComponent(CircleCollider2D).restitution = rt;
    }

    getBallFrame(){
        let sprite = this.getComponent(Sprite).spriteFrame.name;
        if (sprite == "ball2"){
            return 0;
        } else if (sprite == "ball3"){
            return 1;
        } else {
            return -1;
        }    
    }

    // update (deltaTime: number) {

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
