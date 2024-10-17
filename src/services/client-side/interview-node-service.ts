import { UserInterviewModel } from "../../models/entities";
import { PrivateRestService } from "./api-services/private-rest-service";
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

export interface InterviewNode {
    id: string;
    isParentNode: boolean;
    question: string;
    expectedAnswer: string;
    userAnswer?: string;
    questionDialogueId?: string;
    userAnswerDialogueId?: string;
    parentNodeId?: string; // null for parent node
    previousNodeId?: string; // null for the first node
    nextNodeId?: string; // null for the last node
}

export class InterviewNodeService {
    private nodes: { [id: string]: InterviewNode } = {};
    private currentNodeId?: string;
    private privateService: PrivateRestService = new PrivateRestService();
    private userInterview: UserInterviewModel;

    constructor(userInterview: UserInterviewModel) {
        this.userInterview = userInterview;
        this.nodes = userInterview.nodes ?? {};
        this.currentNodeId = userInterview.currentNodeId;
    }

    addNode(previousNodeId: string | null, node: InterviewNode) {
        if (previousNodeId == null) {
            this.nodes[node.id] = node;
        } else {
            node.previousNodeId = previousNodeId;
            this.nodes[previousNodeId].nextNodeId = node.id;

            const nextNodeId = this.nodes[previousNodeId].nextNodeId
            if (nextNodeId) {
                node.nextNodeId = nextNodeId;
                if (this.nodes[nextNodeId]) {
                    this.nodes[nextNodeId].previousNodeId = node.id;
                }
            }
            this.nodes[node.id] = node;
        }
        this.debouncedUpdatUserInterview();
    }

    setCurrentNodeId(id: string) {
        this.currentNodeId = id;
        this.debouncedUpdatUserInterview();
    }

    generateNodeId() {
        return uuidv4();
    }

    getCurrentNode() {
        return this.nodes[this.currentNodeId!];
    }

    getNode(id: string) {
        return this.nodes[id];
    }

    getAllNodes() {
        return this.nodes;
    }

    updateNode(id: string, update: InterviewNode) {
        this.nodes[id] = { ...this.nodes[id], ...update };
        this.debouncedUpdatUserInterview();
    }

    private debouncedUpdatUserInterview = debounce(this.updateUserInterview.bind(this), 1000)

    private async updateUserInterview() {
        this.privateService.updateUserInterview({ userInterviewId: this.userInterview._id, nodes: this.nodes, currentNodeId: this.currentNodeId });
    }
}