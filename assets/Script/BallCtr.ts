
import { _decorator, Component, Node, RigidBody2D, Vec3, BoxCollider2D, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
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

    start () {
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.name == "top<BoxCollider2D>"){         
            if (this.node.getPosition().x > 7){
                this.setBalllv(-20, -3, 5, 0.5);
            } else {
                this.setBalllv(20, -3, 5, 0.5);
            }
        }  
     }

    setBalllv(x, y, gv, rt: number){
        let lv = this.node.getComponent(RigidBody2D).linearVelocity;
        let gravy = this.node.getComponent(RigidBody2D).gravityScale;
        gravy = gv;
        lv.x = x;
        lv.y = y;
        this.node.getComponent(RigidBody2D).linearVelocity = lv;    
        this.node.getComponent(RigidBody2D).gravityScale = gravy;  
        this.node.getComponent(BoxCollider2D).restitution = rt;
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
