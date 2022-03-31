import React from 'react';

const ModalContext = React.createContext({});

export function ModalContextProvider(props) {

  // Debug
  // console.log("ModalContextProvider: Initalizing")

  // New post modal ///
  const [showNewPostModal, setShowNewPostModal] = React.useState(false)

  const closeNewPostModal = React.useCallback(() => {
    setShowNewPostModal(false)
  }, [])
  
  const openNewPostModal = React.useCallback(() => {
    setShowNewPostModal(true)
  }, [])
  ///

  // Edit Post Modal ///
  const [showEditPostModal, setShowEditPostModal] = React.useState(false)

  const closeEditPostModal = React.useCallback(() => {
    setShowEditPostModal(false)
  }, [])
  
  const openEditPostModal = React.useCallback(() => {
    setShowEditPostModal(true)
  }, [])
  ///

  // Edit comment modal ///
  const [showEditCommentModal, setShowEditCommentModal] = React.useState(false)

  const closeEditCommentModal = React.useCallback(() => {
    setShowEditCommentModal(false)
  }, [])
  
  const openEditCommentModal = React.useCallback(() => {
    setShowEditCommentModal(true)
  }, [])
  ///

  return (
    <ModalContext.Provider value={{
      showNewPostModal,
      closeNewPostModal, openNewPostModal,

      showEditPostModal,
      openEditPostModal, closeEditPostModal,

      showEditCommentModal,
      closeEditCommentModal, openEditCommentModal
    }}>
      {props.children}
    </ModalContext.Provider>
  );
}

export const useModalContext = () => React.useContext(ModalContext);