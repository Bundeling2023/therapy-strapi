import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedSocialLinks extends Schema.Component {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'socialLinks';
    icon: 'link';
  };
  attributes: {
    facebook: Attribute.String;
    youtube: Attribute.String;
    instagram: Attribute.String;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    canonicalURL: Attribute.String;
  };
}

export interface PagesSimpePage extends Schema.Component {
  collectionName: 'components_pages_simpe_pages';
  info: {
    displayName: 'simplePage';
    description: '';
  };
  attributes: {
    img: Attribute.Media<'images'>;
    description: Attribute.RichText;
  };
}

export interface PagesPageWithBlocks extends Schema.Component {
  collectionName: 'components_pages_page_with_blocks';
  info: {
    displayName: 'pageWithBlocks';
    description: '';
  };
  attributes: {
    blocks: Attribute.Component<'pages.paga-blocks', true>;
  };
}

export interface PagesPagaBlocks extends Schema.Component {
  collectionName: 'components_pages_paga_blocks';
  info: {
    displayName: 'pageBlocks';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    img: Attribute.Media<'images'>;
    description: Attribute.RichText & Attribute.Required;
    link: Attribute.Relation<'pages.paga-blocks', 'oneToOne', 'api::page.page'>;
  };
}

export interface LocationWorkingHours extends Schema.Component {
  collectionName: 'components_location_working_hours';
  info: {
    displayName: 'workingHours';
  };
  attributes: {
    monday: Attribute.String & Attribute.Required;
    tuesday: Attribute.String & Attribute.Required;
    wednesday: Attribute.String & Attribute.Required;
    thursday: Attribute.String & Attribute.Required;
    friday: Attribute.String & Attribute.Required;
    saturday: Attribute.String & Attribute.Required;
    sunday: Attribute.String & Attribute.Required;
  };
}

export interface HomePageServices extends Schema.Component {
  collectionName: 'components_home_page_services';
  info: {
    displayName: 'services';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    img: Attribute.Media<'images'> & Attribute.Required;
    link: Attribute.Relation<
      'home-page.services',
      'oneToOne',
      'api::page.page'
    >;
  };
}

export interface HomePageMainBanner extends Schema.Component {
  collectionName: 'components_home_page_main_banners';
  info: {
    displayName: 'mainBanner';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    link: Attribute.String & Attribute.Required;
    buttonText: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Maak een afspraak'>;
    img: Attribute.Media<'images'> & Attribute.Required;
  };
}

export interface HomePageContactInfo extends Schema.Component {
  collectionName: 'components_home_page_contact_infos';
  info: {
    displayName: 'contactInfo';
  };
  attributes: {
    email: Attribute.String & Attribute.Required;
    phone: Attribute.String & Attribute.Required;
    mainAddress: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.social-links': SharedSocialLinks;
      'shared.seo': SharedSeo;
      'pages.simpe-page': PagesSimpePage;
      'pages.page-with-blocks': PagesPageWithBlocks;
      'pages.paga-blocks': PagesPagaBlocks;
      'location.working-hours': LocationWorkingHours;
      'home-page.services': HomePageServices;
      'home-page.main-banner': HomePageMainBanner;
      'home-page.contact-info': HomePageContactInfo;
    }
  }
}
