'use strict'
import _ from 'lodash'
import Vue from 'vue'

export default function HomeworkHelper (stash) {
  let that = this
  that.stash = stash
  this._put_question = ({nodeId, question}) => {
    if (nodeId !== null) {
      if (_.has(that.stash.homework, nodeId) === false) {
        _.set(that.stash.homework, nodeId, {publish: false, questions: []})
      }
      that.stash.homework[nodeId].questions.push(question)
    }
  }

  this._clean_questions = (nodeId) => {
    if (nodeId !== null) {
      if (_.has(that.stash.homework, nodeId) === false) {
        _.set(that.stash.homework, nodeId, {publish: false, questions: []})
      } else {
        while (that.stash.homework[nodeId].questions.length !== 0) {
          that.stash.homework[nodeId].questions.pop()
        }
      }
    }
  }

  this._set_homework_publish = ({nodeId, publish}) => {
    that.stash.homework[nodeId].publish = publish
  }

  this._delete_question = ({nodeId, index}) => {
    that.stash.homework[nodeId].questions.splice(index, 1)
  }

  this.get_homework = async (nodeId) => {
    try {
      let response = await Vue.http.get('http://localhost:1234' + '/node/' + nodeId + '/homework')
      let homework = response.data
      that._clean_questions(nodeId)
      that._set_homework_publish({nodeId: nodeId, publish: homework.publish})
      _.forEach(homework.questions, function (question) {
        if (!that.stash.isTeacher) {
          question.solution = {A: false, B: false, C: false, D: false}
        }
        that._put_question({nodeId, question})
      })
    } catch (error) {
      that._clean_questions(nodeId)
    }
  }

  this.save_homework = async (nodeId) => {
    try {
      await Vue.http.post('http://localhost:1234' + '/node/' + nodeId + '/homework', that.stash.homework[nodeId])
    } catch (e) {
    }
  }

  this.put_question = (question) => {
    if (!that.stash.isTeacher) {
      question.solution = {A: false, B: false, C: false, D: false}
    }
    that._put_question(question)
  }

  this.delete_question = ({nodeId, index}) => {
    that._delete_question({nodeId, index})
  }

  this.update_questions = ({nodeId, questions}) => {
    try {
      that._clean_questions(nodeId)
      _.forEach(questions, function (question) {
        if (!that.stash.isTeacher) {
          question.solution = {A: false, B: false, C: false, D: false}
        }
        that._put_question({nodeId, question})
      })
    } catch (error) {
      console.log(error)
    }
  }
}

