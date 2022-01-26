import React, { forwardRef } from 'react';

const SvgMock = forwardRef<HTMLDivElement>((props, ref) => <div {...{ ...props, ref }} />);

export default SvgMock;
