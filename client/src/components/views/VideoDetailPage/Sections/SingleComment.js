import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
const {TextArea} = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickOpenReply = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            videoId: props.videoId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data.result)
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert("cannot save comment")
                }
            })
    }

    const actions = [
        <span onClick={onClickOpenReply} key="comment-basic-reply-to">Reply to </span>
    ]
        

    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="image" />} 
                content={ <p>{props.comment.content}</p>}
            >
            </Comment>
            
            {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px '}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    ></TextArea>
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form> 
            }
            
        </div>
    )
}

export default SingleComment
