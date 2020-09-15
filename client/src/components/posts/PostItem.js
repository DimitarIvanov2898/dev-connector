import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Moment from 'moment'
import {connect} from 'react-redux'
import {addLike, deletePost, removeLike} from '../../actions/post'


const PostItem = ({addLike, removeLike, auth, post: {_id, text, name, avatar, user, like, comments, date}}) => (
        <div className="post bg-white p-1 my-1">
        <div>
          <a href="profile.html">
            <img
              className="round-img"
              src={avatar}
              alt=""
            />
            <h4>{name}</h4>
          </a>
        </div>
        <div>
          <p className="my-1">
            {text}
          </p>
           
          <button type="button" className="btn btn-light" onClick={e => addLike(_id )}>
            <i className="fa fa-thumbs-up"></i>
            {
                like.length > 0 && (
                    <span>{like.length}</span>
                )
            }
            
          </button>
          <button type="button" className="btn btn-light" onClick={e => removeLike(_id )}>
            <i className="fa fa-thumbs-down"></i>
          </button>
          <Link to={`/post/${_id}`} className="btn btn-primary">
            Discussion 
            {
                comments.length > 0 && (
                    <span className='comment-count'>{comments.length}</span>
                )
            }
            
          </Link>
            {!auth.loading && user === auth.user._id && (
                <button type="button" className="btn btn-danger" onClick={e => deletePost(_id )}>
                    <i className="fa fa-times"></i>
                </button>
            )}
          
        </div>
      </div>
)

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, {addLike, removeLike})(PostItem)
