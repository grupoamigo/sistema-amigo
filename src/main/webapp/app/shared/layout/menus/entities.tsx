import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown icon="th-list" name={translate('global.menu.entities.main')} id="entity-menu">
    <MenuItem icon="asterisk" to="/entity/company">
      <Translate contentKey="global.menu.entities.company" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/membership">
      <Translate contentKey="global.menu.entities.membership" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/client">
      <Translate contentKey="global.menu.entities.client" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/manouver">
      <Translate contentKey="global.menu.entities.manouver" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/manouver-request">
      <Translate contentKey="global.menu.entities.manouverRequest" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/cargo">
      <Translate contentKey="global.menu.entities.cargo" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/seal">
      <Translate contentKey="global.menu.entities.seal" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/extra-field">
      <Translate contentKey="global.menu.entities.extraField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/location">
      <Translate contentKey="global.menu.entities.location" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/country-code">
      <Translate contentKey="global.menu.entities.countryCode" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/state-code">
      <Translate contentKey="global.menu.entities.stateCode" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/contact-card">
      <Translate contentKey="global.menu.entities.contactCard" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/service">
      <Translate contentKey="global.menu.entities.service" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/service-quote">
      <Translate contentKey="global.menu.entities.serviceQuote" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/service-request">
      <Translate contentKey="global.menu.entities.serviceRequest" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/contract">
      <Translate contentKey="global.menu.entities.contract" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/inspection">
      <Translate contentKey="global.menu.entities.inspection" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/evidence">
      <Translate contentKey="global.menu.entities.evidence" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/damage">
      <Translate contentKey="global.menu.entities.damage" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/driver">
      <Translate contentKey="global.menu.entities.driver" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/transport">
      <Translate contentKey="global.menu.entities.transport" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/warehouse">
      <Translate contentKey="global.menu.entities.warehouse" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/route">
      <Translate contentKey="global.menu.entities.route" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
