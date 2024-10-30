'use client'

import React, { useEffect, useRef, useState } from 'react'
import { G6, IndentedTree, IndentedTreeOptions } from '@ant-design/graphs';
import { Graph } from '@antv/g6';
import { reactInterviewTree } from './SampleTree';

const { treeToGraphData } = G6;

const SingleInterviewAnalysis = () => {
    const [data, setData] = useState<any>();
    const [graphSize, setGraphSize] = useState({ width: 500, height: 1000 });
    
    useEffect(() => {
        try {
            setData(treeToGraphData(reactInterviewTree))
        } catch (error) {
            console.log(error)
        }
    }, []);

    const options: IndentedTreeOptions = {
        type: 'boxed',
        autoFit: 'view',
        animation: false,
        zoom: 0.1,
        data: data!,
        node: {
            style: {
            }
        },
        onReady: (graph: Graph) => {
            graph.on('node:click', (evt: any) => {
                console.log("Clicked on node:", evt.target.id)
            });
            const size = graph.getCanvas().getSize();
            if (graphSize.width != size[0] || graphSize.height != size[1]) {
                setGraphSize({ width:size[0], height: size[1] })
            }
        },
        onDestroy: () => {
        },
        behaviors: [],
    };

    return (
        <div style={{ height: graphSize.height, width: '600px'}}>
            {data && <IndentedTree {...options} />}
        </div>
    )
}

export default SingleInterviewAnalysis;