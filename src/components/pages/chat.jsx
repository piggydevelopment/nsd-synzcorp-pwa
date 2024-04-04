import React, {useEffect, useState} from 'react'
import { cs_token, cs_url, cs_identifier, cs_hmac_secret } from '../../configs/app';
import { ReactSession } from 'react-client-session';

export default function Chat (props) {
  const {chatMsg} = props;
  const [user, setUser] = useState(ReactSession.get('user'));

  useEffect(() => {
    window.chatwootSettings = {
      hideMessageBubble: props.disabled || false,
      position: "right", 
      locale: "th", 
      type: "expanded_bubble",
      launcherTitle: "ถาม Synz",
    };

    (function(d,t) {
      var BASE_URL = cs_url;
      var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);

      g.onload = async function() {

        await window.chatwootSDK.run({
          websiteToken: cs_token,
          baseUrl: BASE_URL
        });

        if(!user||props.disabled) {
          await window.$chatwoot.toggleBubbleVisibility('hide');
          return () => {}
        } else {
          await setUser(ReactSession.get('user'));
          await window.$chatwoot.toggleBubbleVisibility('show');
        }

        const user_info = {
          name: user.firstname + " " + user.lastname,
          email: user.email,
          phone_number: "+66"+user.phone_number,
          country_code: "TH",
          company_name: "EGAT-"+user.attribute_1+"-"+user.attribute_2
        }

        await window.$chatwoot.setUser(user.id, user_info);
        await window.$chatwoot.setLabel("support-ticket");
        await window.$chatwoot.setConversationCustomAttributes({
            productName: "Mobile number",
            productCategory: "+66"+user.phone_number,
          });
        
      }
    })(document, "script");
  }, []);



  return null;
};
