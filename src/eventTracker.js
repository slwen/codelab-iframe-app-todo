document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const iframeId = urlParams.get('id') || 'default';

  let isDragging = false;
  let dragTarget = null;
  let latestX = 0;
  let latestY = 0;
  let animationFrameId = null;

  const sendDragMessage = (event) => {
    if (isDragging) {
      const isInteractive = isInteractiveElement(dragTarget);
      const hasSelection = window.getSelection().toString().length > 0;
      const hasDragAttrs = hasDragAttributes(dragTarget);
      const isDefaultPrevented = event.defaultPrevented;
      const isMapLike = hasMapLikeStyles(dragTarget)
      const isUsed = isInteractive || hasSelection || hasDragAttrs || isDefaultPrevented || isMapLike;

      window.parent.postMessage({
        type: 'drag',
        data: { iframeId, x: latestX, y: latestY, isUsed },
      }, '*');
      animationFrameId = requestAnimationFrame(() => sendDragMessage(event));
    }
  };

  const handleMouseDown = (event) => {
    isDragging = true;
    latestX = event.clientX;
    latestY = event.clientY;
    dragTarget = event.target;

    const isInteractive = isInteractiveElement(dragTarget);
    const hasSelection = window.getSelection().toString().length > 0;
    const hasDragAttrs = hasDragAttributes(dragTarget);
    const isDefaultPrevented = event.defaultPrevented;
    const isMapLike = hasMapLikeStyles(dragTarget)
    const isUsed = isInteractive || hasSelection || hasDragAttrs || isDefaultPrevented || isMapLike;

    window.parent.postMessage({
      type: 'dragStart',
      data: { iframeId, x: latestX, y: latestY, isUsed },
    }, '*');
    animationFrameId = requestAnimationFrame(() => sendDragMessage(event));
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      latestX = event.clientX;
      latestY = event.clientY;
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      window.parent.postMessage({ type: 'dragEnd', data: { iframeId } }, '*');
      isDragging = false;
      cancelAnimationFrame(animationFrameId);
    }
  };

  const handleClick = (event) => {
    window.parent.postMessage(
      {
        type: 'click',
        data: {
          iframeId,
          x: event.clientX,
          y: event.clientY,
          target: event.target.tagName,
          shiftKey: event.shiftKey,
        },
      },
      '*'
    );
  };

  const handleKeydown = (event) => {
    window.parent.postMessage(
      {
        type: 'keydown',
        data: {
          key: event.key,
          code: event.code,
          repeat: event.repeat,
        },
      },
      '*'
    );
  };

  const sendResizeMessage = () => {
    const contentWidth = document.documentElement.offsetWidth;
    const contentHeight = document.documentElement.offsetHeight;
    window.parent.postMessage(
      {
        type: 'resize',
        data: {
          iframeId,
          width: contentWidth,
          height: contentHeight,
        },
      },
      '*'
    );
  };

  const resizeObserver = new MutationObserver(sendResizeMessage);
  resizeObserver.observe(document.querySelector('#root'), { childList: true, subtree: true });
  
  sendResizeMessage();

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('resize', sendResizeMessage);

  window.addEventListener('unload', () => {
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('resize', sendResizeMessage);
    resizeObserver.disconnect();
  });
});

function isInteractiveElement(el) {
  const interactiveTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'];
  return interactiveTags.includes(el.tagName) || el.isContentEditable;
}

function hasDragAttributes(el) {
  return (
    el.hasAttribute('draggable') ||
    el.classList.contains('draggable') ||
    el.closest('[draggable]')
  );
}

function hasMapLikeStyles(el) {
  const style = window.getComputedStyle(el);
  return style.touchAction === 'none' || style.userSelect === 'none';
}