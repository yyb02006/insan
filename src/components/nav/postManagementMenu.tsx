import { useState } from 'react';
import HamburgerMenuContainer from '@/components/nav/hamburgerMenuContainer';
import PostManagementNav from '@/components/nav/postManagementNav';

export default function PostManagementMenu() {
  const [isAborted, setIsAborted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [onNavigating, setOnNavigating] = useState(false);
  return (
    <HamburgerMenuContainer
      isAborted={isAborted}
      onNavigating={onNavigating}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      <PostManagementNav setIsAborted={setIsAborted} setIsNavigating={setOnNavigating} />
    </HamburgerMenuContainer>
  );
}
