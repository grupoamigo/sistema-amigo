import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './contact-card.reducer';
import { IContactCard } from 'app/shared/model/contact-card.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IContactCardDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ContactCardDetail extends React.Component<IContactCardDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { contactCardEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.contactCard.detail.title">ContactCard</Translate> [<b>{contactCardEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="type">
                <Translate contentKey="sistemaAmigoApp.contactCard.type">Type</Translate>
              </span>
            </dt>
            <dd>{contactCardEntity.type}</dd>
            <dt>
              <span id="value">
                <Translate contentKey="sistemaAmigoApp.contactCard.value">Value</Translate>
              </span>
            </dt>
            <dd>{contactCardEntity.value}</dd>
          </dl>
          <Button tag={Link} to="/entity/contact-card" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/contact-card/${contactCardEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ contactCard }: IRootState) => ({
  contactCardEntity: contactCard.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactCardDetail);
