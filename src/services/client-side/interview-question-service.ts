import { UserInterviewModel } from "../../models/entities";
import { PrivateRestService } from "./api-services/private-rest-service";
import { v4 as uuidv4 } from 'uuid';

export interface InterviewQuestionNode {
    id: string;
    isParentNode: boolean;
    hasAsked: boolean;
    question: string;
    questionDialogueId?: string;
    answer?: string;
    answerDialogueId?: string;
    parentNodeId?: string;
    previousNodeId?: string; // null for the first node
    nextNodeId?: string; // null for the last node
}

export class InterviewQuestionService {
    private nodes: { [id: string]: InterviewQuestionNode } = {};
    private privateService: PrivateRestService = new PrivateRestService();
    private userInterview: UserInterviewModel;

    constructor(userInterview: UserInterviewModel) {
        this.userInterview = userInterview;
        this.nodes = userInterview.nodes ?? {};
    }

    addNode(previousNodeId: string | null, node: InterviewQuestionNode) {
        if (previousNodeId == null) {
            this.nodes[node.id] = node;
        } else {
            node.previousNodeId = previousNodeId;
            this.nodes[previousNodeId].nextNodeId = node.id;
    
            const nextNodeId = this.nodes[previousNodeId].nextNodeId
            if (nextNodeId) {
                node.nextNodeId = nextNodeId
                this.nodes[nextNodeId].previousNodeId = node.id;
            }
            this.nodes[node.id] = node;
        }
      
        this.updateUserInterview();
    }

    generateNodeId() {
        return uuidv4();
    }

    getNode(id: string) {
        return this.nodes[id];
    }

    updateNode(id: string, update: InterviewQuestionNode) {
        this.nodes[id] = { ...this.nodes[id], ...update };
        this.updateUserInterview();
    }

    private async updateUserInterview() {
        this.privateService.updateUserInterview({ userInterviewId: this.userInterview._id, nodes: this.nodes });
    }
}