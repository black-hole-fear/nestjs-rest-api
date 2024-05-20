import { 
    Prop, 
    Schema, 
    SchemaFactory 
} from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    hash: string;

    @Prop({ required: true })
    data: string;    // base64 encoded image
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);