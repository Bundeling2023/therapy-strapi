import type { Schema, Struct } from '@strapi/strapi';

export interface HomePageContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_home_page_contact_infos';
  info: {
    displayName: 'contactInfo';
  };
  attributes: {
    email: Schema.Attribute.String & Schema.Attribute.Required;
    mainAddress: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageMainBanner extends Struct.ComponentSchema {
  collectionName: 'components_home_page_main_banners';
  info: {
    displayName: 'mainBanner';
  };
  attributes: {
    buttonText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Maak een afspraak'>;
    description: Schema.Attribute.Text;
    img: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageServices extends Struct.ComponentSchema {
  collectionName: 'components_home_page_services';
  info: {
    description: '';
    displayName: 'services';
  };
  attributes: {
    img: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LocationWorkingHours extends Struct.ComponentSchema {
  collectionName: 'components_location_working_hours';
  info: {
    displayName: 'workingHours';
  };
  attributes: {
    friday: Schema.Attribute.String & Schema.Attribute.Required;
    monday: Schema.Attribute.String & Schema.Attribute.Required;
    saturday: Schema.Attribute.String & Schema.Attribute.Required;
    sunday: Schema.Attribute.String & Schema.Attribute.Required;
    thursday: Schema.Attribute.String & Schema.Attribute.Required;
    tuesday: Schema.Attribute.String & Schema.Attribute.Required;
    wednesday: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesPagaBlocks extends Struct.ComponentSchema {
  collectionName: 'components_pages_paga_blocks';
  info: {
    description: '';
    displayName: 'pageBlocks';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    img: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesPageWithBlocks extends Struct.ComponentSchema {
  collectionName: 'components_pages_page_with_blocks';
  info: {
    description: '';
    displayName: 'pageWithBlocks';
  };
  attributes: {
    blocks: Schema.Attribute.Component<'pages.paga-blocks', true>;
  };
}

export interface PagesSimpePage extends Struct.ComponentSchema {
  collectionName: 'components_pages_simpe_pages';
  info: {
    description: '';
    displayName: 'simplePage';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    img: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'seo';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'socialLinks';
    icon: 'link';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    tiktok: Schema.Attribute.String;
    youtube: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home-page.contact-info': HomePageContactInfo;
      'home-page.main-banner': HomePageMainBanner;
      'home-page.services': HomePageServices;
      'location.working-hours': LocationWorkingHours;
      'pages.paga-blocks': PagesPagaBlocks;
      'pages.page-with-blocks': PagesPageWithBlocks;
      'pages.simpe-page': PagesSimpePage;
      'shared.seo': SharedSeo;
      'shared.social-links': SharedSocialLinks;
    }
  }
}
