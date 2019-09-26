import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './service-quote.reducer';
import { IServiceQuote } from 'app/shared/model/service-quote.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IServiceQuoteDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ServiceQuoteDetail extends React.Component<IServiceQuoteDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { serviceQuoteEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.serviceQuote.detail.title">ServiceQuote</Translate> [<b>{serviceQuoteEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.title">Title</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.title}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.description">Description</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.description}</dd>
            <dt>
              <span id="quantity">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.quantity">Quantity</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.quantity}</dd>
            <dt>
              <span id="price">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.price">Price</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.price}</dd>
            <dt>
              <span id="unit">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.unit">Unit</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.unit}</dd>
            <dt>
              <span id="expeditionDate">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.expeditionDate">Expedition Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={serviceQuoteEntity.expeditionDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="expirationDate">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.expirationDate">Expiration Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={serviceQuoteEntity.expirationDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="status">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.status">Status</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.status}</dd>
            <dt>
              <span id="currency">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.currency">Currency</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.currency}</dd>
            <dt>
              <span id="approvedBy">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.approvedBy">Approved By</Translate>
              </span>
            </dt>
            <dd>{serviceQuoteEntity.approvedBy}</dd>
            <dt>
              <span id="qrCode">
                <Translate contentKey="sistemaAmigoApp.serviceQuote.qrCode">Qr Code</Translate>
              </span>
            </dt>
            <dd>
              {serviceQuoteEntity.qrCode ? (
                <div>
                  <a onClick={openFile(serviceQuoteEntity.qrCodeContentType, serviceQuoteEntity.qrCode)}>
                    <img
                      src={`data:${serviceQuoteEntity.qrCodeContentType};base64,${serviceQuoteEntity.qrCode}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {serviceQuoteEntity.qrCodeContentType}, {byteSize(serviceQuoteEntity.qrCode)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.serviceQuote.contract">Contract</Translate>
            </dt>
            <dd>{serviceQuoteEntity.contract ? serviceQuoteEntity.contract.title : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/service-quote" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/service-quote/${serviceQuoteEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ serviceQuote }: IRootState) => ({
  serviceQuoteEntity: serviceQuote.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceQuoteDetail);
