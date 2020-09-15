import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getPost} from '../../actions/post'

const Post = ({ getPost, post: { post, loading }, computedMatch }) => {
    useEffect(() => {
        getPost(computedMatch.params.id);
      }, [getPost, computedMatch.params.id]);
    

    
    return (
        <div>
            test
        </div>
    )
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
} 

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPost})(Post)
