import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'
const { TextArea } = Input;

function Comment(props) {

    
    const user = useSelector(state => state.user)
    const [CommentValue, setCommentValue] = useState("")

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        const variables = {
            content: CommentValue ,
            writer: user.userData._id,
            videoId: props.videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data.result)
                    setCommentValue("")
                    
                    props.refreshFunction(response.data.result)
                } else {
                    alert("cannot save comment")
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <br />

            {/* Comment lists */}

            {props.commentList && props.commentList.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={index} >
                        <SingleComment videoId={props.videoId} comment={comment} refreshFunction={props.refreshFunction} />
                        <ReplyComment commentList={props.commentList} videoId={props.videoId} parentCommentId={comment._id} refreshFunction={props.refreshFunction}/>
                    </React.Fragment>
                )
            ))}
            
            {/* Root Comment Form */}
            <form style={{ display: 'flex'}} onSubmit={onSubmit} >
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange = {handleClick}
                    value = {CommentValue}
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</Button>

            </form>

        </div>
    )
}

export default Comment
