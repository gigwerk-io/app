import { Animation } from '@ionic/core';

export function popOutAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapper = baseEl.querySelector('.modal-wrapper');
  const header = wrapper.querySelector('ion-header');
  const body = wrapper.querySelector('ion-content');

  const headerAnimation = new AnimationC();
  headerAnimation.addElement(header);
  headerAnimation
    .fromTo('transform', 'translateX(0%)', 'translateX(100%)')
    .fromTo('opacity', 1, 0);

  const bodyAnimation = new AnimationC();
  bodyAnimation.addElement(body);
  bodyAnimation
    .fromTo('transform', 'translateY(0%) translateX(0%) scaleX(1) scaleY(1)', 'translateY(100%) translateX(0%) scaleX(1) scaleY(1)')
    .fromTo('opacity', 1, 0);

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(wrapper);
  wrapperAnimation.add(headerAnimation);
  wrapperAnimation.add(bodyAnimation);
  wrapperAnimation
    .fromTo('transform', 'translateY(0%) scaleX(1) scaleY(1)', 'translateY(0%) scaleX(1) scaleY(1)')
    //   .fromTo('transform', 'translateX(100%) scaleX(0.3)', 'translateX(0%) scaleX(1)')
    .fromTo('opacity', 0, 1);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));

}
